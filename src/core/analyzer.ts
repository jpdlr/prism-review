import Anthropic from '@anthropic-ai/sdk';
import type {
  PullRequest,
  ReviewResult,
  Risk,
  Suggestion,
  TestGap,
} from '../types/index.js';
import { getAnthropicApiKey, getConfigValue } from '../utils/config.js';

const SYSTEM_PROMPT = `You are an expert code reviewer. Analyze pull request changes and provide structured feedback.

Your review should be:
- Constructive and actionable
- Focused on real issues, not style nitpicks
- Prioritized by impact
- Specific with file names and line references where possible

You must respond with valid JSON matching this exact structure:
{
  "summary": "Brief 2-3 sentence summary of what this PR does",
  "risks": [
    {
      "severity": "critical|high|medium|low",
      "file": "filename.ts",
      "line": 42,
      "description": "What the risk is",
      "suggestion": "How to fix it"
    }
  ],
  "suggestions": [
    {
      "file": "filename.ts",
      "line": 10,
      "category": "performance|security|maintainability|best-practice|style",
      "description": "What could be improved",
      "code": "optional code snippet"
    }
  ],
  "testGaps": [
    {
      "file": "filename.ts",
      "description": "What testing is missing",
      "priority": "high|medium|low",
      "suggestedTests": ["test case 1", "test case 2"]
    }
  ]
}

Guidelines for severity:
- critical: Security vulnerabilities, data loss risks, breaking changes
- high: Bugs, logic errors, significant performance issues
- medium: Code smells, minor bugs, suboptimal patterns
- low: Minor improvements, edge cases

Focus on:
1. Security issues (injection, auth, secrets exposure)
2. Logic errors and bugs
3. Performance concerns
4. Error handling gaps
5. Missing validation
6. Test coverage gaps`;

function buildUserPrompt(pr: PullRequest): string {
  const filesContent = pr.files
    .filter((f) => f.patch)
    .map((f) => {
      return `### ${f.filename} (${f.status})
+${f.additions} -${f.deletions}

\`\`\`diff
${f.patch}
\`\`\``;
    })
    .join('\n\n');

  return `## Pull Request: ${pr.title}

**Author:** ${pr.author}
**Branch:** ${pr.headBranch} → ${pr.baseBranch}
**Stats:** ${pr.changedFiles} files changed, +${pr.additions} -${pr.deletions}

### Description
${pr.description || '_No description provided_'}

---

## Changed Files

${filesContent}

---

Analyze these changes and provide your structured review as JSON.`;
}

interface AnalyzerOutput {
  summary: string;
  risks: Risk[];
  suggestions: Suggestion[];
  testGaps: TestGap[];
}

export async function analyzePullRequest(pr: PullRequest): Promise<ReviewResult> {
  const client = new Anthropic({
    apiKey: getAnthropicApiKey(),
  });

  const model = getConfigValue('defaultModel') || 'claude-sonnet-4-20250514';

  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(pr),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from AI');
  }

  let parsed: AnalyzerOutput;
  try {
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    parsed = JSON.parse(jsonMatch[0]) as AnalyzerOutput;
  } catch {
    throw new Error(`Failed to parse AI response: ${textBlock.text.slice(0, 200)}`);
  }

  return {
    pr,
    summary: parsed.summary,
    risks: parsed.risks || [],
    suggestions: parsed.suggestions || [],
    testGaps: parsed.testGaps || [],
    generatedAt: new Date(),
    modelUsed: model,
  };
}

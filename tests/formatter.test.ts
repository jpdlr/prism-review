import { describe, it, expect } from 'vitest';
import { formatForGitHub, formatAsJson } from '../src/core/formatter.js';
import type { ReviewResult } from '../src/types/index.js';

const mockReviewResult: ReviewResult = {
  pr: {
    number: 42,
    title: 'Add new feature',
    description: 'This PR adds a cool new feature',
    author: 'testuser',
    baseBranch: 'main',
    headBranch: 'feature/new-thing',
    url: 'https://github.com/owner/repo/pull/42',
    additions: 150,
    deletions: 30,
    changedFiles: 5,
    files: [
      {
        filename: 'src/index.ts',
        status: 'modified',
        additions: 100,
        deletions: 20,
        patch: '@@ -1,5 +1,10 @@\n+new line',
      },
    ],
  },
  summary: 'This PR introduces a new feature that improves user experience.',
  risks: [
    {
      severity: 'high',
      file: 'src/index.ts',
      line: 42,
      description: 'Potential null pointer exception',
      suggestion: 'Add null check before accessing property',
    },
    {
      severity: 'low',
      file: 'src/utils.ts',
      description: 'Minor optimization opportunity',
    },
  ],
  suggestions: [
    {
      file: 'src/index.ts',
      line: 10,
      category: 'performance',
      description: 'Consider memoizing this computation',
      code: 'const memoized = useMemo(() => compute(), [deps])',
    },
  ],
  testGaps: [
    {
      file: 'src/index.ts',
      description: 'Missing unit tests for edge cases',
      priority: 'high',
      suggestedTests: [
        'Test with empty input',
        'Test with invalid data',
      ],
    },
  ],
  generatedAt: new Date('2024-01-15T10:00:00Z'),
  modelUsed: 'claude-sonnet-4-20250514',
};

describe('formatForGitHub', () => {
  it('includes prism-review marker comment', () => {
    const output = formatForGitHub(mockReviewResult);
    expect(output).toContain('<!-- prism-review -->');
  });

  it('includes summary section', () => {
    const output = formatForGitHub(mockReviewResult);
    expect(output).toContain('### 📋 Summary');
    expect(output).toContain('This PR introduces a new feature');
  });

  it('includes risk assessment table', () => {
    const output = formatForGitHub(mockReviewResult);
    expect(output).toContain('### ⚠️ Risk Assessment');
    expect(output).toContain('| Severity | File | Issue | Suggestion |');
    expect(output).toContain('🟠 High');
    expect(output).toContain('Potential null pointer exception');
  });

  it('includes suggestions section', () => {
    const output = formatForGitHub(mockReviewResult);
    expect(output).toContain('### 💡 Suggestions');
    expect(output).toContain('performance');
    expect(output).toContain('Consider memoizing');
  });

  it('includes test gaps section', () => {
    const output = formatForGitHub(mockReviewResult);
    expect(output).toContain('### 🧪 Test Coverage Gaps');
    expect(output).toContain('Missing unit tests');
    expect(output).toContain('Test with empty input');
  });

  it('includes footer with model info', () => {
    const output = formatForGitHub(mockReviewResult);
    expect(output).toContain('Prism Review');
    expect(output).toContain('claude-sonnet-4-20250514');
  });
});

describe('formatAsJson', () => {
  it('returns valid JSON', () => {
    const output = formatAsJson(mockReviewResult);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it('includes all review data', () => {
    const output = formatAsJson(mockReviewResult);
    const parsed = JSON.parse(output);
    expect(parsed.summary).toBe(mockReviewResult.summary);
    expect(parsed.risks).toHaveLength(2);
    expect(parsed.suggestions).toHaveLength(1);
    expect(parsed.testGaps).toHaveLength(1);
  });
});

describe('formatForGitHub with no issues', () => {
  it('shows no risks message when risks array is empty', () => {
    const noIssuesResult: ReviewResult = {
      ...mockReviewResult,
      risks: [],
      suggestions: [],
      testGaps: [],
    };
    const output = formatForGitHub(noIssuesResult);
    expect(output).toContain('### ✅ No Significant Risks');
    expect(output).toContain('No critical issues found');
  });
});

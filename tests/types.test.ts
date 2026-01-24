import { describe, it, expect } from 'vitest';
import type {
  PullRequest,
  ReviewResult,
  Risk,
  Suggestion,
  TestGap,
  RiskSeverity,
} from '../src/types/index.js';

describe('Type definitions', () => {
  it('PullRequest type has correct structure', () => {
    const pr: PullRequest = {
      number: 1,
      title: 'Test PR',
      description: 'Test description',
      author: 'testuser',
      baseBranch: 'main',
      headBranch: 'feature',
      url: 'https://github.com/owner/repo/pull/1',
      additions: 10,
      deletions: 5,
      changedFiles: 2,
      files: [
        {
          filename: 'test.ts',
          status: 'modified',
          additions: 10,
          deletions: 5,
          patch: '+new code',
        },
      ],
    };

    expect(pr.number).toBe(1);
    expect(pr.files).toHaveLength(1);
    expect(pr.files[0].status).toBe('modified');
  });

  it('Risk severity levels are correct', () => {
    const severities: RiskSeverity[] = ['critical', 'high', 'medium', 'low'];
    expect(severities).toContain('critical');
    expect(severities).toContain('high');
    expect(severities).toContain('medium');
    expect(severities).toContain('low');
  });

  it('Risk type has correct structure', () => {
    const risk: Risk = {
      severity: 'high',
      file: 'test.ts',
      line: 42,
      description: 'Test risk',
      suggestion: 'Fix it',
    };

    expect(risk.severity).toBe('high');
    expect(risk.line).toBe(42);
  });

  it('Suggestion categories are valid', () => {
    const suggestion: Suggestion = {
      file: 'test.ts',
      category: 'security',
      description: 'Test suggestion',
    };

    expect(['performance', 'security', 'maintainability', 'best-practice', 'style'])
      .toContain(suggestion.category);
  });

  it('TestGap priorities are valid', () => {
    const gap: TestGap = {
      file: 'test.ts',
      description: 'Missing tests',
      priority: 'high',
      suggestedTests: ['Test 1', 'Test 2'],
    };

    expect(['high', 'medium', 'low']).toContain(gap.priority);
    expect(gap.suggestedTests).toHaveLength(2);
  });
});

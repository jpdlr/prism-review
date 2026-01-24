export interface PrismConfig {
  anthropicApiKey?: string;
  githubToken?: string;
  defaultModel?: string;
  maxFilesPerReview?: number;
}

export interface PullRequest {
  number: number;
  title: string;
  description: string;
  author: string;
  baseBranch: string;
  headBranch: string;
  url: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  files: PullRequestFile[];
}

export interface PullRequestFile {
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed';
  additions: number;
  deletions: number;
  patch?: string;
  previousFilename?: string;
}

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Risk {
  severity: RiskSeverity;
  file: string;
  line?: number;
  description: string;
  suggestion?: string;
}

export interface Suggestion {
  file: string;
  line?: number;
  category: 'performance' | 'security' | 'maintainability' | 'best-practice' | 'style';
  description: string;
  code?: string;
}

export interface TestGap {
  file: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  suggestedTests: string[];
}

export interface ReviewResult {
  pr: PullRequest;
  summary: string;
  risks: Risk[];
  suggestions: Suggestion[];
  testGaps: TestGap[];
  generatedAt: Date;
  modelUsed: string;
}

export interface ParsedPrUrl {
  owner: string;
  repo: string;
  number: number;
}

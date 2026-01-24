import { Octokit } from '@octokit/rest';
import type { PullRequest, PullRequestFile, ParsedPrUrl } from '../types/index.js';
import { getGitHubToken } from '../utils/config.js';

let octokitInstance: Octokit | null = null;

function getOctokit(): Octokit {
  if (!octokitInstance) {
    octokitInstance = new Octokit({
      auth: getGitHubToken(),
    });
  }
  return octokitInstance;
}

export async function fetchPullRequest(parsed: ParsedPrUrl): Promise<PullRequest> {
  const octokit = getOctokit();
  const { owner, repo, number } = parsed;

  const { data: pr } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: number,
  });

  const { data: filesData } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: number,
    per_page: 100,
  });

  const files: PullRequestFile[] = filesData.map((file) => ({
    filename: file.filename,
    status: file.status as PullRequestFile['status'],
    additions: file.additions,
    deletions: file.deletions,
    patch: file.patch,
    previousFilename: file.previous_filename,
  }));

  return {
    number: pr.number,
    title: pr.title,
    description: pr.body || '',
    author: pr.user?.login || 'unknown',
    baseBranch: pr.base.ref,
    headBranch: pr.head.ref,
    url: pr.html_url,
    additions: pr.additions,
    deletions: pr.deletions,
    changedFiles: pr.changed_files,
    files,
  };
}

export async function postPrComment(
  parsed: ParsedPrUrl,
  body: string
): Promise<string> {
  const octokit = getOctokit();
  const { owner, repo, number } = parsed;

  const { data: comment } = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: number,
    body,
  });

  return comment.html_url;
}

export async function findExistingPrismComment(
  parsed: ParsedPrUrl
): Promise<number | null> {
  const octokit = getOctokit();
  const { owner, repo, number } = parsed;

  const { data: comments } = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: number,
    per_page: 100,
  });

  const prismComment = comments.find((c) =>
    c.body?.includes('<!-- prism-review -->')
  );

  return prismComment?.id ?? null;
}

export async function updatePrComment(
  parsed: ParsedPrUrl,
  commentId: number,
  body: string
): Promise<string> {
  const octokit = getOctokit();
  const { owner, repo } = parsed;

  const { data: comment } = await octokit.issues.updateComment({
    owner,
    repo,
    comment_id: commentId,
    body,
  });

  return comment.html_url;
}

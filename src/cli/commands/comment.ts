import ora from 'ora';
import { parsePrReference } from '../../utils/parser.js';
import { fetchPullRequest, postPrComment, findExistingPrismComment, updatePrComment } from '../../core/github.js';
import { analyzePullRequest } from '../../core/analyzer.js';
import { formatForGitHub } from '../../core/formatter.js';
import { logger } from '../../utils/logger.js';

interface CommentOptions {
  update?: boolean;
}

export async function commentCommand(
  prReference: string,
  options: CommentOptions
): Promise<void> {
  const spinner = ora();

  try {
    // Parse PR reference
    const parsed = parsePrReference(prReference);
    logger.info(`Analyzing PR #${parsed.number} from ${parsed.owner}/${parsed.repo}`);

    // Fetch PR data
    spinner.start('Fetching pull request...');
    const pr = await fetchPullRequest(parsed);
    spinner.succeed(`Fetched PR: ${pr.title}`);

    if (pr.files.length === 0) {
      logger.warning('No files changed in this PR');
      return;
    }

    // Analyze with AI
    spinner.start('Analyzing changes with AI...');
    const result = await analyzePullRequest(pr);
    spinner.succeed('Analysis complete');

    // Format for GitHub
    const markdown = formatForGitHub(result);

    // Check for existing comment
    spinner.start('Posting comment...');

    if (options.update) {
      const existingId = await findExistingPrismComment(parsed);
      if (existingId) {
        const url = await updatePrComment(parsed, existingId, markdown);
        spinner.succeed('Updated existing comment');
        logger.success(`Comment updated: ${url}`);
        return;
      }
    }

    const url = await postPrComment(parsed, markdown);
    spinner.succeed('Posted review comment');
    logger.success(`Comment posted: ${url}`);
  } catch (error) {
    spinner.fail('Failed to post comment');
    if (error instanceof Error) {
      logger.error(error.message);
    }
    process.exit(1);
  }
}

import ora from 'ora';
import { parsePrReference } from '../../utils/parser.js';
import { fetchPullRequest } from '../../core/github.js';
import { analyzePullRequest } from '../../core/analyzer.js';
import { formatForTerminal, formatAsJson } from '../../core/formatter.js';
import { logger } from '../../utils/logger.js';

interface AnalyzeOptions {
  json?: boolean;
}

export async function analyzeCommand(
  prReference: string,
  options: AnalyzeOptions
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

    logger.info(`Found ${pr.files.length} changed files (+${pr.additions} -${pr.deletions})`);

    // Analyze with AI
    spinner.start('Analyzing changes with AI...');
    const result = await analyzePullRequest(pr);
    spinner.succeed('Analysis complete');

    // Output results
    if (options.json) {
      console.log(formatAsJson(result));
    } else {
      console.log(formatForTerminal(result));
    }
  } catch (error) {
    spinner.fail('Analysis failed');
    if (error instanceof Error) {
      logger.error(error.message);
    }
    process.exit(1);
  }
}

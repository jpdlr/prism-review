import { Command } from 'commander';
import { analyzeCommand } from './commands/analyze.js';
import { commentCommand } from './commands/comment.js';
import {
  configShowCommand,
  configSetCommand,
  configClearCommand,
  configPathCommand,
} from './commands/config.js';

export function createCli(): Command {
  const program = new Command();

  program
    .name('prism')
    .description('AI-powered code review assistant for GitHub PRs')
    .version('0.1.0');

  // Analyze command
  program
    .command('analyze <pr>')
    .alias('a')
    .description('Analyze a pull request and output the review')
    .option('--json', 'Output as JSON instead of formatted text')
    .action(analyzeCommand);

  // Comment command
  program
    .command('comment <pr>')
    .alias('c')
    .description('Analyze a pull request and post review as a comment')
    .option('-u, --update', 'Update existing Prism comment instead of creating new')
    .action(commentCommand);

  // Config command group
  const configCmd = program
    .command('config')
    .description('Manage configuration');

  configCmd
    .command('show')
    .description('Show current configuration')
    .action(configShowCommand);

  configCmd
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action(configSetCommand);

  configCmd
    .command('clear')
    .description('Clear all configuration')
    .action(configClearCommand);

  configCmd
    .command('path')
    .description('Print the configuration file path')
    .action(configPathCommand);

  return program;
}

import chalk from 'chalk';

export const logger = {
  info: (message: string) => {
    console.log(chalk.blue('ℹ'), message);
  },

  success: (message: string) => {
    console.log(chalk.green('✓'), message);
  },

  warning: (message: string) => {
    console.log(chalk.yellow('⚠'), message);
  },

  error: (message: string) => {
    console.error(chalk.red('✖'), message);
  },

  debug: (message: string) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray('⋯'), chalk.gray(message));
    }
  },

  blank: () => {
    console.log();
  },

  divider: () => {
    console.log(chalk.gray('─'.repeat(60)));
  },

  header: (title: string) => {
    console.log();
    console.log(chalk.bold.cyan(title));
    console.log(chalk.gray('─'.repeat(title.length)));
  },
};

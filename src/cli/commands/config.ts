import chalk from 'chalk';
import {
  getConfig,
  setConfigValue,
  getConfigPath,
  clearConfig,
  getConfigValue,
} from '../../utils/config.js';
import { logger } from '../../utils/logger.js';

const CONFIG_KEYS = [
  'anthropicApiKey',
  'githubToken',
  'defaultModel',
  'maxFilesPerReview',
] as const;

type ConfigKey = (typeof CONFIG_KEYS)[number];

export function configShowCommand(): void {
  const config = getConfig();

  logger.header('Prism Review Configuration');
  console.log();

  console.log(`  ${chalk.cyan('anthropicApiKey')}: ${maskSensitive('anthropicApiKey', config.anthropicApiKey)}`);
  console.log(`  ${chalk.cyan('githubToken')}: ${maskSensitive('githubToken', config.githubToken)}`);
  console.log(`  ${chalk.cyan('defaultModel')}: ${config.defaultModel ?? chalk.gray('(not set)')}`);
  console.log(`  ${chalk.cyan('maxFilesPerReview')}: ${config.maxFilesPerReview ?? chalk.gray('(not set)')}`);

  console.log();
  console.log(chalk.gray(`Config file: ${getConfigPath()}`));
}

export function configSetCommand(key: string, value: string): void {
  if (!CONFIG_KEYS.includes(key as ConfigKey)) {
    logger.error(`Unknown config key: ${key}`);
    console.log();
    console.log('Available keys:');
    for (const k of CONFIG_KEYS) {
      console.log(`  - ${k}`);
    }
    process.exit(1);
  }

  const typedKey = key as ConfigKey;

  // Handle numeric values
  if (typedKey === 'maxFilesPerReview') {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) {
      logger.error('maxFilesPerReview must be a positive number');
      process.exit(1);
    }
    setConfigValue(typedKey, numValue);
  } else {
    setConfigValue(typedKey, value);
  }

  logger.success(`Set ${key} = ${maskSensitive(typedKey, value)}`);
}

export function configClearCommand(): void {
  clearConfig();
  logger.success('Configuration cleared');
}

export function configPathCommand(): void {
  console.log(getConfigPath());
}

function maskSensitive(key: ConfigKey, value: unknown): string {
  if (value === undefined || value === null) {
    return chalk.gray('(not set)');
  }

  const strValue = String(value);

  if (key === 'anthropicApiKey' || key === 'githubToken') {
    if (strValue.length <= 8) {
      return '********';
    }
    return strValue.slice(0, 4) + '****' + strValue.slice(-4);
  }

  return strValue;
}

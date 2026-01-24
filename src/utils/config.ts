import Conf from 'conf';
import type { PrismConfig } from '../types/index.js';

export type { PrismConfig };

const config = new Conf<PrismConfig>({
  projectName: 'prism-review',
  schema: {
    anthropicApiKey: {
      type: 'string',
    },
    githubToken: {
      type: 'string',
    },
    defaultModel: {
      type: 'string',
      default: 'claude-sonnet-4-20250514',
    },
    maxFilesPerReview: {
      type: 'number',
      default: 50,
    },
  },
});

export function getConfig(): PrismConfig {
  return config.store;
}

export function setConfigValue<K extends keyof PrismConfig>(
  key: K,
  value: PrismConfig[K]
): void {
  config.set(key, value);
}

export function getConfigValue<K extends keyof PrismConfig>(
  key: K
): PrismConfig[K] {
  return config.get(key);
}

export function clearConfig(): void {
  config.clear();
}

export function getConfigPath(): string {
  return config.path;
}

export function getAnthropicApiKey(): string {
  const key = config.get('anthropicApiKey') || process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      'Anthropic API key not configured. Run: prism config set anthropicApiKey <key>'
    );
  }
  return key;
}

export function getGitHubToken(): string {
  const token = config.get('githubToken') || process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      'GitHub token not configured. Run: prism config set githubToken <token>'
    );
  }
  return token;
}

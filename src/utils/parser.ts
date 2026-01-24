import type { ParsedPrUrl } from '../types/index.js';

const PR_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
const PR_SHORT_REGEX = /^([^/]+)\/([^/]+)#(\d+)$/;

export function parsePrReference(input: string): ParsedPrUrl {
  // Try full URL format: https://github.com/owner/repo/pull/123
  const urlMatch = input.match(PR_URL_REGEX);
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2],
      number: parseInt(urlMatch[3], 10),
    };
  }

  // Try short format: owner/repo#123
  const shortMatch = input.match(PR_SHORT_REGEX);
  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2],
      number: parseInt(shortMatch[3], 10),
    };
  }

  throw new Error(
    `Invalid PR reference: "${input}". ` +
      'Use format: https://github.com/owner/repo/pull/123 or owner/repo#123'
  );
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : plural ?? `${singular}s`;
}

import { describe, it, expect } from 'vitest';
import { parsePrReference, truncate, pluralize } from '../src/utils/parser.js';

describe('parsePrReference', () => {
  it('parses full GitHub URL', () => {
    const result = parsePrReference('https://github.com/owner/repo/pull/123');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      number: 123,
    });
  });

  it('parses GitHub URL without https', () => {
    const result = parsePrReference('github.com/owner/repo/pull/456');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      number: 456,
    });
  });

  it('parses GitHub URL with www', () => {
    const result = parsePrReference('https://www.github.com/owner/repo/pull/789');
    expect(result).toEqual({
      owner: 'owner',
      repo: 'repo',
      number: 789,
    });
  });

  it('parses short format owner/repo#number', () => {
    const result = parsePrReference('facebook/react#12345');
    expect(result).toEqual({
      owner: 'facebook',
      repo: 'react',
      number: 12345,
    });
  });

  it('throws on invalid format', () => {
    expect(() => parsePrReference('invalid')).toThrow('Invalid PR reference');
    expect(() => parsePrReference('owner/repo')).toThrow('Invalid PR reference');
    expect(() => parsePrReference('123')).toThrow('Invalid PR reference');
  });

  it('handles complex repo names', () => {
    const result = parsePrReference('org-name/repo-name.js#42');
    expect(result).toEqual({
      owner: 'org-name',
      repo: 'repo-name.js',
      number: 42,
    });
  });
});

describe('truncate', () => {
  it('returns original string if shorter than max', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and adds ellipsis', () => {
    expect(truncate('hello world', 8)).toBe('hello...');
  });

  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });
});

describe('pluralize', () => {
  it('returns singular for count of 1', () => {
    expect(pluralize(1, 'file')).toBe('file');
  });

  it('returns plural for count of 0', () => {
    expect(pluralize(0, 'file')).toBe('files');
  });

  it('returns plural for count > 1', () => {
    expect(pluralize(5, 'file')).toBe('files');
  });

  it('uses custom plural form', () => {
    expect(pluralize(2, 'person', 'people')).toBe('people');
  });
});

# 🔮 Prism Review

> AI-powered code review assistant that analyzes GitHub pull requests and provides structured feedback with risk assessment, improvement suggestions, and test coverage analysis.

[![CI](https://github.com/jpdlr/prism-review/actions/workflows/ci.yml/badge.svg)](https://github.com/jpdlr/prism-review/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## What It Does

Prism Review uses Claude AI to analyze your pull requests and provides:

- **📋 Summary** — Concise overview of what the PR accomplishes
- **⚠️ Risk Assessment** — Security vulnerabilities, bugs, and breaking changes with severity ratings
- **💡 Suggestions** — Performance, maintainability, and best practice improvements
- **🧪 Test Coverage Gaps** — Missing test scenarios and edge cases

## Quick Start

### Installation

```bash
# Clone and install globally
git clone https://github.com/jpdlr/prism-review.git
cd prism-review
npm install
npm link

# Or install directly from npm (coming soon)
# npm install -g prism-review
```

### Configuration

```bash
# Set your API keys
prism config set anthropicApiKey sk-ant-...
prism config set githubToken ghp_...

# Or use environment variables
export ANTHROPIC_API_KEY=sk-ant-...
export GITHUB_TOKEN=ghp_...
```

### Usage

```bash
# Analyze a PR and output to terminal
prism analyze https://github.com/owner/repo/pull/123

# Short format works too
prism analyze owner/repo#123

# Output as JSON
prism analyze owner/repo#123 --json

# Post review as a PR comment
prism comment owner/repo#123

# Update existing Prism comment
prism comment owner/repo#123 --update
```

## Example Output

### Terminal Output

```
═══════════════════════════════════════════════════════
  PRISM REVIEW
═══════════════════════════════════════════════════════

PR #42: Add user authentication
feature/auth → main
5 files • +150 -30

📋 Summary
───────────────────────────────────────────────────────
This PR implements JWT-based authentication with login and
logout endpoints, password hashing, and session management.

⚠️ Risk Assessment
───────────────────────────────────────────────────────
🔴 CRITICAL src/auth.ts
   Potential SQL injection in user lookup query
   → Use parameterized queries or an ORM

🟠 HIGH src/middleware.ts:45
   JWT secret loaded from environment without fallback
   → Add validation to fail fast if secret is missing

💡 Suggestions
───────────────────────────────────────────────────────
⚡ src/auth.ts [performance]
   Password hashing is synchronous and blocks the event loop
   Consider using bcrypt's async methods

🧪 Test Coverage Gaps
───────────────────────────────────────────────────────
● src/auth.ts
  Missing unit tests for edge cases
  Suggested tests:
    • Test with expired tokens
    • Test with malformed JWT
    • Test rate limiting behavior
```

### GitHub PR Comment

When you use `prism comment`, it posts a formatted review directly to the PR:

```markdown
## 🔍 Prism Review

### 📋 Summary
This PR implements JWT-based authentication with login/logout endpoints.

> **5** files changed • **+150** additions • **-30** deletions

### ⚠️ Risk Assessment

| Severity | File | Issue | Suggestion |
|:--------:|------|-------|------------|
| 🔴 Critical | `src/auth.ts` | SQL injection vulnerability | Use parameterized queries |
| 🟠 High | `src/middleware.ts:45` | Missing secret validation | Add fail-fast check |

### 💡 Suggestions

- ⚡ **`src/auth.ts`** _(performance)_
  Password hashing blocks event loop. Use async bcrypt methods.

### 🧪 Test Coverage Gaps

<details><summary>🔴 <b>src/auth.ts</b> - Missing edge case tests</summary>

**Suggested tests:**
- [ ] Test with expired tokens
- [ ] Test with malformed JWT
- [ ] Test rate limiting behavior

</details>
```

## Commands

| Command | Description |
|---------|-------------|
| `prism analyze <pr>` | Analyze PR and output to terminal |
| `prism comment <pr>` | Analyze PR and post as GitHub comment |
| `prism config show` | Display current configuration |
| `prism config set <key> <value>` | Set a configuration value |
| `prism config clear` | Clear all configuration |
| `prism config path` | Show config file location |

### PR Reference Formats

Both URL and short formats are supported:

```bash
# Full GitHub URL
prism analyze https://github.com/facebook/react/pull/12345

# Short format
prism analyze facebook/react#12345
```

## Configuration Options

| Key | Description | Default |
|-----|-------------|---------|
| `anthropicApiKey` | Anthropic API key for Claude | - |
| `githubToken` | GitHub personal access token | - |
| `defaultModel` | Claude model to use | `claude-sonnet-4-20250514` |
| `maxFilesPerReview` | Maximum files to analyze | `50` |

### Required GitHub Token Permissions

Your GitHub token needs these permissions:
- `repo` — Access private repositories
- `read:org` — Read organization data (for org repos)

[Create a token here →](https://github.com/settings/tokens/new?scopes=repo,read:org)

## How It Works

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   GitHub API     │────▶│   Prism Core     │────▶│   Claude AI      │
│   (PR + Diff)    │     │   (Analysis)     │     │   (Review)       │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Output         │
                         │ Terminal / GH    │
                         └──────────────────┘
```

1. **Fetch** — Retrieves PR metadata and file diffs from GitHub
2. **Analyze** — Sends structured context to Claude for code review
3. **Format** — Transforms AI response into actionable feedback
4. **Output** — Displays in terminal or posts as PR comment

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode for development
npm run dev
```

### Project Structure

```
prism-review/
├── src/
│   ├── cli/           # CLI commands
│   ├── core/          # GitHub, analyzer, formatter
│   ├── types/         # TypeScript definitions
│   └── utils/         # Config, logging, parsing
├── tests/             # Vitest test suites
└── dist/              # Compiled output
```

## Tech Stack

- **TypeScript** — Type-safe codebase
- **Commander.js** — CLI framework
- **Octokit** — GitHub API client
- **Anthropic SDK** — Claude AI integration
- **Vitest** — Testing framework
- **Chalk + Ora** — Terminal styling

## License

MIT © [jpdlr](https://github.com/jpdlr)

---

<p align="center">
  <sub>Built with 🔮 by <a href="https://github.com/jpdlr">jpdlr</a></sub>
</p>

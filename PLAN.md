# Prism Review - Implementation Plan

## Overview
AI-powered code review assistant that analyzes GitHub PRs and provides structured feedback including summaries, risk assessment, improvement suggestions, and test coverage gaps.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLI Interface                        │
│  prism analyze <pr>  │  prism comment <pr>  │  prism config │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Core Engine                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ PR Fetcher  │  │  AI Analyzer │  │ Review Formatter │   │
│  │  (GitHub)   │  │  (Anthropic) │  │   (Markdown)     │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Output                               │
│    Terminal  │  Markdown File  │  GitHub PR Comment         │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack
- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **GitHub Integration**: Octokit
- **AI Provider**: Anthropic Claude API
- **Testing**: Vitest
- **Output**: Markdown with structured sections

## Core Features

### 1. PR Analysis
- Fetch PR metadata (title, description, author, branch)
- Fetch diff/changed files
- Analyze each file change with AI
- Generate consolidated review

### 2. Review Output Structure
```markdown
## 📋 Summary
Brief overview of what this PR does

## ⚠️ Risk Assessment
| Risk | Severity | File | Description |
|------|----------|------|-------------|
| ... | High/Medium/Low | ... | ... |

## 💡 Suggestions
- Improvement recommendations
- Code quality observations
- Performance considerations

## 🧪 Test Coverage
- Missing test scenarios
- Edge cases to consider
- Integration test recommendations

## 📊 Stats
- Files changed: X
- Additions: +Y
- Deletions: -Z
```

### 3. CLI Commands
- `prism analyze <pr-url|number>` - Analyze and output to terminal
- `prism comment <pr-url|number>` - Post analysis as PR comment
- `prism config set <key> <value>` - Configure API keys
- `prism config show` - Show current configuration

## Implementation Phases

### Phase 1: Project Setup
- [x] Initialize repo
- [ ] TypeScript + build config
- [ ] CLI entrypoint
- [ ] Configuration management

### Phase 2: GitHub Integration
- [ ] PR fetching with Octokit
- [ ] Diff parsing
- [ ] File content retrieval

### Phase 3: AI Analysis
- [ ] Anthropic SDK integration
- [ ] Prompt engineering for code review
- [ ] Structured output parsing

### Phase 4: Output & Formatting
- [ ] Markdown formatter
- [ ] Terminal output with colors
- [ ] GitHub comment posting

### Phase 5: Polish
- [ ] Error handling
- [ ] Rate limiting
- [ ] Caching
- [ ] Tests
- [ ] CI/CD

## File Structure
```
prism-review/
├── src/
│   ├── index.ts           # CLI entrypoint
│   ├── cli/
│   │   ├── commands/
│   │   │   ├── analyze.ts
│   │   │   ├── comment.ts
│   │   │   └── config.ts
│   │   └── index.ts
│   ├── core/
│   │   ├── github.ts      # GitHub API client
│   │   ├── analyzer.ts    # AI analysis engine
│   │   └── formatter.ts   # Output formatting
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── config.ts      # Config management
│       └── logger.ts
├── tests/
│   ├── analyzer.test.ts
│   ├── github.test.ts
│   └── formatter.test.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
└── LICENSE
```

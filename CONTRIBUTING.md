# Contributing to DrugEye

Thank you for your interest in contributing! This document will get you up and running.

## Quick Start

1. **Fork & Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/z-ai-pharmacy-platform.git
   cd z-ai-pharmacy-platform
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment**

   ```bash
   cp .env.example .env
   # Edit .env with your values (see below)
   ```

4. **Run Development Server**

   ```bash
   npm run dev
   ```

## Finding Issues to Work On

- **[Good First Issues](https://github.com/ibrahimawadallah/z-ai-pharmacy-platform/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)** - Start here!
- **[Help Wanted](https://github.com/ibrahimawadallah/z-ai-pharmacy-platform/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)** - Issues needing community help
- **[Size: Small](https://github.com/ibrahimawadallah/z-ai-pharmacy-platform/issues?q=is%3Aissue+is%3Aopen+label%3Asize%3Asmall)** - Quick wins (< 2 hours)

## Issue Labels

| Label | Meaning |
|-------|---------|
| `good first issue` | Great for newcomers |
| `help wanted` | Maintainer seeking help |
| `size:small` | Can finish in one session |
| `frontend` | React/Next.js/UI work |
| `backend` | API/Database work |
| `api` | REST endpoints |
| `testing` | Tests/QA |
| `documentation` | Docs/README |
| `security` | Auth/Vulnerabilities |
| `i18n` | Translations |

## Development Workflow

1. **Comment on the issue** you want to work on - ask to be assigned
2. **Create a branch** from `develop`: `git checkout -b feature/issue-123-short-description`
3. **Make your changes** with clear commit messages
4. **Test locally**: `npm run test` and `npm run lint`
5. **Push and create PR** with `Closes #123` in the description

## Issue/PR Template

Good issues and PRs include:
- **Context**: Why this change matters
- **What changed**: Summary of modifications
- **How to test**: Steps to verify
- **Screenshots**: For UI changes

## Getting Help

- Comment on the issue you're working on
- Discord: [discord.gg/drugeye](https://discord.gg/drugeye)
- Mentors (ping in issues): @ibrahimawadallah

## Code Style

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Testing**: Vitest for unit tests
- **Commits**: Clear, present tense ("Add feature" not "Added feature")

## Security

Report security issues privately to: security@drugeye.ae

---

Happy coding! 🚀

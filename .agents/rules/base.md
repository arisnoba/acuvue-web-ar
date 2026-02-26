---
description: Core project guidelines. Apply these rules when working on any code, documentation, or configuration files.
alwaysApply: true
inclusion: always
---

# Project Structure and Overview

This document provides a structural overview of the project, designed to aid AI code assistants in understanding the codebase.

Please refer to `README.md` for a complete and up-to-date project overview.



# Coding Guidelines

- The assistant shall follow the Airbnb JavaScript Style Guide.
- The assistant shall maintain feature-based directory structure and avoid dependencies between features.
- If a file exceeds 250 lines, then the assistant shall split it into multiple files based on functionality.
- Where non-obvious logic exists, the assistant shall add comments in Korean to clarify.
- When implementing new features, the assistant shall provide corresponding unit tests.
- When implementation is complete, the assistant shall verify changes by running:
  ```bash
  npm run lint  # Ensure code style compliance
  npm run test  # Verify all tests pass
  ```

## Commit Messages

- The assistant shall follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for all commit messages.
- The assistant shall always include a scope in commit messages.
- The assistant shall use the format: `type(scope): Description`
  ```
  # Examples:
  feat(auth): Add social login support
  fix(api): Handle null response from server
  docs(readme): Update installation guide
  style(ui): Update button hover color
  refactor(utils): Split helper into smaller modules
  test(components): Add tests for Button component
  ```
- The assistant shall use types: feat, fix, docs, style, refactor, test, chore, etc.
- The assistant shall use scope to indicate the affected part of the codebase (app, api, components, utils, config, etc.).
- The assistant shall write description in clear, concise present tense starting with a capital letter.

### Commit Body Guidelines

- When writing commit body, the assistant shall include context about what led to this commit.
- When writing commit body, the assistant shall describe the conversation or problem that motivated the change.

## Pull Request Guidelines

- When creating a pull request, the assistant shall follow the template:
  ```md
  <!-- Please include a summary of the changes -->

  ## Checklist

  - [ ] Run `npm run test`
  - [ ] Run `npm run lint`
  ```
- When creating a pull request, the assistant shall include a clear summary of the changes at the top.
- Where related issues exist, the assistant shall reference them using `#issue-number`.

## PR Review Guidelines

When reviewing pull requests, the assistant shall provide thoughtful feedback on the following topics:
- Code quality and best practices
- Potential bugs or issues
- Suggestions for improvements
- Overall architecture and design decisions

## Dependencies and Testing

- The assistant shall inject dependencies through a deps object parameter for testability.
- Example:
  ```typescript
  export const functionName = async (
    param1: Type1,
    param2: Type2,
    deps = {
      defaultFunction1,
      defaultFunction2,
    }
  ) => {
    // Use deps.defaultFunction1() instead of direct call
  };
  ```
- When writing tests, the assistant shall mock dependencies by passing test doubles through deps object.
- If dependency injection is not feasible, then the assistant shall use vi.mock().

## Generate Comprehensive Output

- The assistant shall include all content without abbreviation, unless specified otherwise.
- The assistant shall optimize for handling large codebases while maintaining output quality.

# GitHub Release Note Guidelines

- When writing release notes, the assistant shall reference issues or PRs using gh command to verify content:
  ```bash
  gh issue view <issue-number>  # For checking issue content
  gh pr view <pr-number>        # For checking PR content
  ```
- When writing release notes, the assistant shall follow the project's established release note format.

# Contributing to Atomic Habits Tracker

Thank you for considering contributing to Atomic Habits Tracker! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be kind and considerate to others, and refrain from any form of harassment or discrimination.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the issue, and find related reports.

**Before Submitting A Bug Report**

* Check the existing issues to see if the problem has already been reported. If it has, add a comment to the existing issue instead of opening a new one.
* Determine which repository the problem should be reported in.
* Gather the information you'll need to include in your report.

**How Do I Submit A (Good) Bug Report?**

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

* Use a clear and descriptive title for the issue to identify the problem.
* Describe the exact steps which reproduce the problem in as many details as possible.
* Provide specific examples to demonstrate the steps. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
* Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
* Explain which behavior you expected to see instead and why.
* Include screenshots or animated GIFs which demonstrate the problem.
* If the problem is related to performance or memory, include a CPU profile capture with your report.
* If the problem wasn't triggered by a specific action, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion**

* Check if the enhancement has already been suggested. 
* Determine which repository the enhancement should be suggested in.

**How Do I Submit A (Good) Enhancement Suggestion?**

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

* Use a clear and descriptive title for the issue to identify the suggestion.
* Provide a step-by-step description of the suggested enhancement in as many details as possible.
* Provide specific examples to demonstrate the steps or features if applicable.
* Describe the current behavior and explain which behavior you expected to see instead and why.
* Explain why this enhancement would be useful to most users.
* Specify which version of the project you're using.
* Specify the name and version of the browser and OS you're using.

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible.
* End all files with a newline
* Place requires/imports in the following order:
   * Built-in Node Modules (such as 'path')
   * Local Modules (using relative paths)
* Format your code with prettier and lint with ESLint
* Include thoughtfully-worded, well-structured test cases where applicable

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🚱 `:non-potable_water:` when plugging memory leaks
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * 💚 `:green_heart:` when fixing the CI build
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies
    * 👕 `:shirt:` when removing linter warnings

### JavaScript Styleguide

* Use 2 spaces for indentation
* Use semicolons
* Use camelCase for variables, properties, and function names
* Use PascalCase for classes and React components
* Use UPPERCASE for constants
* Prefer arrow functions
* Prefer template strings over string concatenation
* Prefer destructuring assignment
* Prefer spread operator over `Object.assign` and array methods
* Add trailing commas for multi-line arrays and objects
* Use async/await over Promises directly when possible

### TypeScript Styleguide

Follow the same guidelines as JavaScript, plus:
* Always define types for function parameters and return values
* Use interfaces for object types
* Use type aliases for union types or complex types
* Use enums for constants related to each other
* Enable strict mode in tsconfig
* Avoid using `any` type

### CSS/Tailwind Styleguide

* Use utility classes following the Tailwind documentation
* Group Tailwind classes logically (layout, typography, color, etc.)
* Extract common pattern to components
* Use custom CSS sparingly, only when Tailwind doesn't provide a solution

### Documentation Styleguide

* Use Markdown
* Reference code elements in backticks
* Provide examples for API functions
* Link to relevant sections in the codebase where appropriate
* Keep documentation updated as code changes

## Development Process

### Setup

1. Fork the repository
2. Clone your fork locally
3. Install dependencies with `npm install`
4. Create a branch for your feature or fix

### Testing

* Run tests with `npm test`
* Ensure your changes don't break existing functionality
* Add tests for new features

### Submitting Changes

1. Push your branch to your fork
2. Submit a pull request
3. Wait for CI checks to pass
4. Request review from maintainers
5. Make any requested changes
6. Once approved, your PR will be merged

## Additional Resources

* [General GitHub documentation](https://docs.github.com/)
* [GitHub Pull Request documentation](https://docs.github.com/en/github/collaborating-with-pull-requests)

Thank you for contributing to Atomic Habits Tracker!
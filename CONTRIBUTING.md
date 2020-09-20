
# Contributing

- [General guidelines](#general-guidelines)
  - [Pull requests](#pull-requests)
  - [Commit messages](#commit-messages)
- [Running tests](#running-tests)

## General guidelines

These are the general guidelines you should follow when contributing with PRs to this project:

### Pull requests

Follow these basic rules:

- one change per PR: PRs should be small and easy to read. Do not mix different subjects, do not fix different things, do not piggyback unnecessary typo fixes or unrelated npm updates. Avoid changing formatting unless you're touching the very code that needs to be re-formatted;

- make sure your new logic is fully covered by unit tests;

- proposing code optimizations? Prove them by adding benchmarks!

- review your code first. Look for unused code, strive for proper formatting, see if everything makes sense. Act as if you were reviewing someone else's PR and criticize it. Spare the time of the final reviewer;

- avoid opening PRs with simple documentation formatting or pure coding style changes. If you want to contribute to open source projects, put some effort into it. Help by fixing known bugs or improving performance;

- give a great description: prove to the reviewer that you did a good job. State the problem, why it needs to be fixed and how did you do it. The PR title should be meaningful and succinct;

- inline comments are welcome to explain the hard parts.

### Commit messages

Follow these basic rules:

* be descriptive;
* limit the subject line to 50 characters;
* use the imperative mood in the subject line;
* capitalize the subject line;
* do not end the subject line with a period;
* separate subject from body with a blank line;
* wrap the body at 72 characters;
* use the body to explain what and why vs. how.

Some good examples:

- "Add insertion logic"
- "Fix typo in introduction to user guide"
- "Remove unused code"
- "Improve ordering efficiency"

And now some **bad** ones and why they are bad:

- "WIP" (be descriptive)
- "Adding insertion logic" ("Add", not "Adding")
- "Fixed typo in introduction to user guide" ("Fix", not "Fixed")
- "Remove unused code." (unwanted period at the end)
- "improve ordering efficiency" (first word is not capitalized)

For more information, see [this](https://chris.beams.io/posts/git-commit/).

## Running tests

Use npm to run unit tests locally:

    npm run test

There's also a benchmark script:

    npm run bench

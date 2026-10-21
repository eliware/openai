# AGENTS.md

## Project

Eliware maintains `@eliware/openai`, a Node.js 26 native ESM package.
The package wraps the official OpenAI SDK and provides Responses transports, types, and cost estimates.

## Scope and boundaries

Keep package code and its public API in this repository.
Follow the OpenAI API, published pricing, and repository specifications.
Request Eliware Operations authorization before publication.

## Layout

- Keep public entrypoints in `src/index.mjs` and `src/index.d.ts`.
- Keep implementation files in `src/` and matching tests in `tests/`.
- Keep user guides in `docs/`, examples in `examples/`, and specifications in `specs/`.
- Keep CI files in `.github/workflows/` and Knit files in `.knit/`.

## Development

Read the related specification before you change public behavior.
Keep declarations, examples, guides, and specifications current with public behavior.

## Validation

Use Node.js 26 or later. Run `npm ci` before validation.
Run each required check with its package command.

- Run `npm test` for full validation.
- Run `npm run lint` for lint checks.
- Run `npm run format` to format maintained files.
- Run `npm run format:check` to check formatting.
- Run `npm run audit` for dependency and repository checks.
- Run `npm run typecheck` to check TypeScript declarations.
- Run `npm run pack` to check package contents.

## Security

Keep credentials private. Use safe placeholders in examples.
Do not commit `.env` files or credentials.

## Changes

Record user-visible changes in `RELEASE_NOTES.md`.
Keep package version changes in `package.json`.

## Library

- Run focused tests first during development.
- Pass one or more test paths to `npm test` for focused testing.
- Run one test file with `npm test -- tests/path/to/example.test.mjs`.
- Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
- Prevent repeated full-suite runs during development.
- Run the full `npm test` suite for final validation before a commit, milestone, or release.

## npm publication

Include `specs/` in `package.json` files.
Document install steps, entrypoints, package files, version rules, and release limits in `README.md`.
Keep `package.json` files valid under npm rules.
Run `npm run pack` before release inspection.

Match each `v#.#.#` tag to `package.json.version`.
Run Ubuntu validation before release inspection.
Request Eliware Operations authorization before publication.

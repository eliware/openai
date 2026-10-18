# AGENTS.md

## Project

Maintain `@eliware/openai`, a Node.js 26 native ESM package. The package wraps the official OpenAI SDK. It provides HTTP and WebSocket Responses transports, TypeScript declarations, and token cost estimates.

## Scope and boundaries

Keep package code and its public API in this repository. Follow OpenAI API behavior and pricing. Follow Eliware conventions. Request Eliware Operations approval before publication.

## Layout

- Keep public entrypoints in `src/index.mjs` and `src/index.d.ts`.
- Keep implementation files in `src/` and matching tests in `tests/`.
- Keep user guides in `docs/`, examples in `examples/`, and specifications in `specs/`.
- Keep CI files in `.github/workflows/` and Knit files in `.knit/`.

## Development

- Keep declarations, examples, guides, and specifications in sync with public behavior.
- Keep source files at 100 lines or less and test files at 200 lines or less.
- Update the related specification before you change public behavior.
- Do not add legacy aliases or undocumented fallback behavior.

## Validation

- Use Node.js 26 or later and native ESM.
- Run `npm ci` before validation.
- Run `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, and `npm run pack`.

## Security

- Keep credentials private.
- Use safe placeholders in `.env.example`.
- Do not commit `.env` files or credentials.

## Changes

- Keep the package version in `package.json`.
- Record user changes in `RELEASE_NOTES.md`.
- Do not publish without approval from Eliware Operations.

## Library

- Run focused tests first during development.
- Run one test file with `npm test -- tests/path/to/example.test.mjs`.
- Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
- Prevent repeated full-suite runs during development.
- Run the full `npm test` suite for final validation before a commit, milestone, or release.
- Export public names from the package root.
- Keep declarations beside their runtime entrypoint.
- Do not add legacy aliases or undocumented fallback behavior.

## npm publication

- Include `specs/` in the package.
- Document installation, entrypoints, package files, and release limits in `README.md`.
- Keep `package.json.files` valid under npm rules.
- Run `npm run pack` before release inspection.
- Use a `v#.#.#` tag that matches the package version.
- Run Ubuntu validation before release inspection.

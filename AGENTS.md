# AGENTS.md

## Project

Maintain `@eliware/openai`, a Node.js 26 native ESM package. It wraps the official OpenAI SDK. It provides HTTP and WebSocket Responses transports, TypeScript declarations, and token cost estimates.

## Scope and boundaries

This repository owns the package code and public API. OpenAI defines service behavior and prices. Eliware conventions define shared rules. Eliware Operations defines release approval.

## Layout

- Keep package entrypoints in `src/index.mjs` and `src/index.d.ts`.
- Keep implementation in `src/` and matching tests in `tests/`.
- Keep user guides in `docs/`, examples in `examples/`, and project contracts in `specs/`.
- Keep CI workflows in `.github/workflows/` and Knit workflows in `.knit/`.

## Development

- Keep declarations, examples, docs, and specifications in sync with public behavior.
- Keep one test for each source module.
- Keep source files at 100 lines or less and test files at 200 lines or less.
- Update the relevant specification before you change public behavior.
- Do not add legacy aliases or undocumented fallback behavior.

## Validation

Use Node.js 26 or later and native ESM. Run `npm ci`, `npm test`, `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, and `npm run pack`.

## Security

Keep credentials private. Use safe placeholders in `.env.example`. Do not commit `.env` or credentials.

## Changes

Keep package version data in `package.json` and user changes in `RELEASE_NOTES.md`. Do not publish without an Eliware Operations release approval.

## Library

Export the public API from the package root. Keep declarations beside their runtime entrypoint. Do not add legacy aliases or undocumented fallback behavior.

## npm publication

Keep the package public and enable npm provenance. Keep `package.json.files` valid under npm conventions. Run `npm run pack` before release review. Use a `v#.#.#` tag that matches the package version. Run Ubuntu validation before release review.

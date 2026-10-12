# AGENTS.md

Applies to this repository and all subdirectories. Follow more specific instructions when they apply.

## Project

Maintain `@eliware/openai`, a Node.js 26 native ESM package. The package wraps the official OpenAI SDK. It provides HTTP and WebSocket Responses transports, TypeScript declarations, and token pricing tools. Use `OPENAI_API_KEY` for runtime authentication. The package has no runtime configuration file or command line interface.

## Scope and boundaries

This repository owns the package implementation and public contract. OpenAI defines service behavior and prices. Eliware conventions define shared policy. Eliware Operations defines release authorization. Read [conventions](https://github.com/eliware/conventions), [Eliware Docs](https://github.com/eliware/docs), and [Operations](https://github.com/eliware/operations) for those rules.

## Layout

- Keep the package entrypoints at `src/index.mjs` and `src/index.d.ts`.
- Keep implementation files under `src/` and matching tests under `tests/`.
- Keep user guidance under `docs/`, examples under `examples/`, and contracts under `specs/`.
- Keep CI workflows under `.github/workflows/` and Knit workflows under `.knit/`.

## Development

Read this file, [README.md](README.md), [user documentation](docs/README.md), and [specifications](specs/README.md) before you edit files.
Keep public declarations, examples, docs, and specifications in sync.
Keep one test for each source module.
Keep source files at 100 lines or less. Keep test files at 200 lines or less.
Do not add legacy aliases or undocumented fallback behavior.

## Validation

Use Node.js 26 or later and native ESM.
Run `npm ci` to install locked dependencies.
Run `npm test` for full validation.
Run `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, and `npm run pack` as needed.
The package file list is set in `package.json`. Keep `package-lock.json` in the repository.
The pack check validates consumer files against package rules.

## Security

Never commit `.env`, API keys, tokens, or credentials.
Use `.env.example` only with safe placeholders.
Never log secrets or add machine-specific paths to repository files.

## Changes

Update the relevant specification before you change public behavior.
Update focused tests, implementation, declarations, docs, examples, and release notes.
Report only validation that you ran.
Do not publish the package without an explicit Operations release handoff.

## Library

The package root exports the API through `src/index.mjs` and declares it in `src/index.d.ts`.
Keep internal modules connected through their owning modules.
Do not add compatibility facades, legacy aliases, or undocumented fallbacks.
Use `npm run typecheck` for declaration checks and `npm test` for package validation.

## npm publication

The package name is `@eliware/openai`. `package.json` sets the version. `RELEASE_NOTES.md` records user-visible changes.
Use the exact `files` list in `package.json`.
Use npm provenance and a `v#.#.#` tag that matches the package version.
Run the Ubuntu validation workflow before release consideration.
After an authorized publication, confirm the exact version on npm.
These instructions do not authorize publication.

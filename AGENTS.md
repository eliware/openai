# AGENTS.md

Applies repository-wide to the entire `eliware/openai` repository and all subdirectories unless a more-specific instruction file applies. Instructions must remain actionable, current, and concise.

## Project

Purpose: this repository, `eliware/openai`, maintains `@eliware/openai`, a Node.js 26 native ESM package whose `.mjs` modules wrap the official OpenAI SDK and provide public declarations, Responses transports, pricing utilities, tests, and examples. The runtime environment setting is `OPENAI_API_KEY`; the library has no runtime config file or CLI.

## Scope and boundaries

Repository-wide instructions apply to every directory; more-specific instructions in a subdirectory apply only there. The repository scope is this package's implementation and public contract. OpenAI service behavior is defined by OpenAI. Eliware-wide policy is defined by [eliware/conventions](../conventions/README.md); cross-repository context by [eliware/docs](../docs/README.md); and release authorization by [eliware/operations](../operations/README.md). Keep project scope, ownership boundaries, and operational responsibilities distinct.

## Layout

- Required structure: `index.mjs` and `index.d.ts` are the public runtime entrypoint and declarations; implementation files live under `src/`, with matching test files under `tests/`.
- `src/`: single-responsibility implementation modules.
- `tests/`: matching implementation tests; cross-cutting tests remain at the corresponding top-level test path.
- `docs/`, `specs/`, and `examples/`: user guidance, normative project records, and runnable examples.
- `.github/workflows/` and `.knit/`: CI, authorized publication, and secondary validation configuration.

## Development

Repository-wide instructions apply throughout the repository; more-specific instructions in a subdirectory apply only within that subdirectory. Read this file, [README.md](README.md), and applicable [user documentation](docs/README.md) and [specifications](specs/README.md) before editing. Keep exports and declarations synchronized, maintain one-to-one source/test paths, and keep source files to 100 lines and test files to 200 lines. These concise, actionable project-specific requirements supplement and do not weaken shared conventions. Do not add legacy aliases or undocumented fallback behavior.

## Validation

On Node.js 26, validate the native ESM `.mjs` modules with `npm ci`, global `eliware-test`, `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, and `npm run pack`. Runtime environment configuration is `OPENAI_API_KEY`; there are no runtime config files or CLI arguments. The package allowlist is exactly `index.mjs`, `src/`, `index.d.ts`, `README.md`, `LICENSE`, `examples/`, `RELEASE_NOTES.md`, `docs/`, and `specs/`. Before release consideration, the shared pack gate must pass and its resulting file list must match this allowlist. The npm registry's latest `@eliware/test` is 6.0.1, whereas the globally provisioned validator is 8.0.0; this intentional tooling-version deviation is not a behavior or security exception. Do not replace shared validation commands with direct tool invocations.

## Security

Never commit `.env`, API keys, tokens, or other credentials. Use `.env.example` only for documented settings and safe placeholders. Do not log secrets or add machine-specific paths, credentials, or user state to repository files.

## Changes

Update the normative specification before changing public behavior, then update focused tests, implementation, declarations, docs, examples, and release notes. Report only validation actually run. Project-specific rules must not weaken shared requirements; any intentional deviation must be documented and explicitly authorized. Publication requires an explicit Operations release handoff; these instructions do not grant publication authority.

## Library

The public API boundary is the root `index.mjs` and `index.d.ts`; internal modules are wired directly, not through compatibility facades. Compatibility is intentionally breaking at 8.0.0: no legacy aliases or fallbacks. Packaging uses the exact file allowlist under Validation. Validate public declarations with `npm run typecheck`, behavior with global `eliware-test`, and consumer package contents with `npm run pack` before release consideration.

## npm publication

The package identity is `@eliware/openai`; `package.json` is the version source and `RELEASE_NOTES.md` records user-visible changes. The exact `files` allowlist is `index.mjs`, `src/`, `index.d.ts`, `README.md`, `LICENSE`, `examples/`, `RELEASE_NOTES.md`, `docs/`, and `specs/`. Pack validation command: `eliware-test --pack` (also available as `npm run pack`). Required result: the command must pass and the packed files exactly match the allowlist. Publication uses npm provenance (`publishConfig.provenance: true`) and an exact `v#.#.#` tag matching the package version, after Ubuntu validation succeeds. Release gates are global `eliware-test`, typecheck, and pack validation. After explicitly authorized publication, verify that the exact version is available on the public registry. Publication requires explicit authorization through the Operations release handoff; this document does not authorize publishing.

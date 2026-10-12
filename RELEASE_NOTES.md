# Release Notes

## Unreleased

### Changed

- No unreleased changes.

## 12.0.0 — 2026-10-12

### Added

- Add GPT-6.1 Sol to the pricing catalog with its current standard text-token rates.
- Add a typed package entrypoint under `src/`.

### Changed

- Update package dependencies and repository conventions to version 12.
- Document pricing limits for Fast, Ultrafast, Batch, Flex, and regional processing.
- Update CI and npm publication workflows.

## 8.0.0 — 2026-09-24

### Breaking changes

- Remove the `responses-ws` alias and Azure-specific construction.
- Reject concurrent WebSocket response requests.
- Do not reconnect or replay interrupted requests.
- Require a Node-compatible custom WebSocket constructor.
- Do not support browser-native WebSocket constructors.

### Added

- Add standard text-token pricing, usage normalization, cost breakdowns, and aggregation for GPT-5.6 Luna, Terra, and Sol and GPT-6 Astra, Sol, and Luna.
- Add GPT-6 async tool and reasoning configuration support through the official OpenAI SDK.
- Add WebSocket mid-turn steering and same-connection continuation methods.

### Fixed

- Remove the internal source barrel and export supported APIs from the root entrypoint.

### Migration

- Select WebSocket transport with `transport: 'websocket'`.
- Remove `responses-ws` and Azure construction from client setup.
- Handle WebSocket concurrency errors without automatic reconnect or request replay.
- Read the [GPT-6 migration guide](https://developers.openai.com/api/docs/guides/latest-model) for request constraints.

## 1.1.11 — 2026-08-07

### Changed

- Align repository structure, package metadata, validation scripts, CI, and documentation with Eliware library conventions.
- Add TypeScript declaration checks and package dry-run validation.
- Update `ws` to 8.21.3 and move tests under `tests/`.

## 1.1.10 — 2026-08-07

### Changed

- Normalize package metadata formatting while preserving the public API and dependencies.

## 1.1.9 — 2026-08-06

### Added

- Add Responses WebSocket lifecycle APIs: `ready()`, `isOpen()`, `state`, and awaitable `close()`.
- Add bounded WebSocket shutdown, abort support, normalized events, and `ResponsesError` handling.
- Add HTTP and WebSocket callbacks, injectable WebSocket implementations, and deterministic mock transport.
- Add tool, MCP, reasoning, shell call, and output item streaming support.
- Expand TypeScript declarations, examples, tests, and documentation.

## 1.1.8 — 2026-08-06

### Fixed

- Remove the last Istanbul coverage ignore directive from the WebSocket adapter.

## 1.1.7 — 2026-08-06

### Added

- Add HTTP and Responses WebSocket transports, streaming, queue support, TypeScript, and examples.

## 1.1.6 — 2026-08-06

### Fixed

- Fix Azure example lint and environment checks.

## 1.1.5 — 2026-08-06

### Added

- Add manual workflow dispatch, SDK option passthrough, Azure client support, declarations, docs, and tests.

## 1.1.4 — 2026-08-06

### Changed

- Add the standard Oxlint command and Node.js 26 maintenance updates.

## 1.1.3 — 2026-08-06

### Changed

- Standardize Node.js 26 CI, coverage scripts, AgentX ignore rules, dependencies, and lockfiles.

## 1.1.2 — 2026-07-01

### Changed

- Record the 1.1.2 release.

## 1.1.1 — 2025-12-09

### Changed

- Record the 1.1.1 release.

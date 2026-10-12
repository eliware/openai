# Release Notes

## Unreleased

### Changed

No unreleased changes.

## 12.0.0 — 2026-10-12

### Breaking changes

- Remove the `responses-ws` alias and Azure-specific client setup.
- Reject concurrent WebSocket response requests.
- Stop automatic WebSocket reconnect and request replay after interruption.
- Require a Node-compatible WebSocket constructor. Do not support the browser-native constructor.

### Added

- Add standard token cost estimates for GPT-5.6 Luna, Terra, and Sol and GPT-6 Astra, Sol, 6.1 Sol, and Luna.
- Add usage normalization, cost breakdowns, and per-model cost totals.
- Add HTTP and WebSocket event helpers, callbacks, normalized events, and typed errors.
- Add WebSocket lifecycle methods, abort support, mid-response steering, and response continuation.
- Add GPT-6 async function tool types and support through the official SDK.
- Add TypeScript declarations and runnable examples for HTTP, WebSocket, pricing, and GPT-6 features.

### Changed

- Move public runtime and declaration entrypoints under `src/`.
- Apply the 272,000-token long-context policy and the 1.25 cache-write multiplier to cost estimates.
- Keep WebSocket shutdown awaitable and bounded.

### Fixed

- Preserve raw event data and available response and request IDs.
- Normalize HTTP and WebSocket failures as `ResponsesError` values.
- Reject invalid usage data, unsupported pricing models, and concurrent WebSocket requests.

### Migration

- Select WebSocket transport with `transport: "websocket"`.
- Remove `responses-ws` and Azure-specific setup from client code.
- Handle WebSocket interruption without automatic reconnect or request replay.
- Read the [GPT-6 migration guide](https://developers.openai.com/api/docs/guides/latest-model) for request limits.

## 1.1.11 — 2026-08-07

### Changed

- Align package structure, metadata, validation, CI, and docs with Eliware library conventions.
- Add declaration checks and package validation. Move tests under `tests/`.
- Update `ws` to 8.21.3.

## 1.1.10 — 2026-08-07

### Changed

- Format package metadata. Keep the public API and dependencies unchanged.

## 1.1.9 — 2026-08-06

### Added

- Add Responses WebSocket lifecycle methods, bounded shutdown, abort support, normalized events, and `ResponsesError` handling.
- Add HTTP and WebSocket callbacks, custom WebSocket support, and a test transport.
- Add tool, MCP, reasoning, shell call, and output item events.
- Expand declarations, examples, tests, and docs.

## 1.1.8 — 2026-08-06

### Fixed

- Remove the final Istanbul coverage ignore directive from the WebSocket adapter.

## 1.1.7 — 2026-08-06

### Added

- Add HTTP and Responses WebSocket transports, event streams, queue support, TypeScript, and examples.

## 1.1.6 — 2026-08-06

### Fixed

- Fix Azure example lint and environment checks.

## 1.1.5 — 2026-08-06

### Added

- Add manual workflow dispatch, SDK option support, Azure client support, declarations, docs, and tests.

## 1.1.4 — 2026-08-06

### Changed

- Add the standard Oxlint command and Node.js 26 maintenance updates.

## 1.1.3 — 2026-08-06

### Changed

- Standardize Node.js 26 CI, coverage scripts, AgentX ignore rules, dependencies, and lockfiles.

## 1.1.2 — 2026-07-01

### Changed

- Record release 1.1.2.

## 1.1.1 — 2025-12-09

### Changed

- Record release 1.1.1.

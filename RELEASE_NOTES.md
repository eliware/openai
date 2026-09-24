# Release Notes

## Unreleased

## 8.0.0 — 2026-09-24

### Changes

- 8.0.0 removes the legacy `responses-ws` alias and Azure-specific construction, rejects concurrent WebSocket response requests, and does not reconnect or replay interrupted work.
- WebSocket adapters require a Node-compatible custom constructor; browser-native WebSocket constructors are unsupported.
- Standard text-token pricing, usage normalization, cost breakdowns, and aggregation for GPT-5.6 Luna, Terra, and Sol and GPT-6 Astra, Sol, and Luna.
- GPT-6 async tool and reasoning-configuration update support through the official OpenAI SDK.
- WebSocket mid-turn steering and same-connection continuation methods.

### Fixed

- Removed the internal source barrel and made the root public entrypoint export supported APIs directly.

### Migration

- Select the WebSocket transport with `transport: 'websocket'`; remove `responses-ws` and Azure construction.
- Handle WebSocket concurrency rejection and interrupted requests without relying on automatic reconnect or replay.
- GPT-6 request constraints are validated by the API; see the [GPT-6 migration guide](https://developers.openai.com/api/docs/guides/latest-model).

## 1.1.11 — 2026-08-07

- Aligned repository structure, package metadata, validation scripts, CI, documentation, and release notes with Eliware library conventions.
- Added TypeScript declaration checking and standardized package dry-run validation.
- Updated `ws` to 8.21.3 and moved tests under `tests/`.

## 1.1.10 — 2026-08-07

- Normalized package metadata formatting while preserving the public API and dependency set.

## 1.1.9 — 2026-08-07

- Added Responses WebSocket lifecycle APIs: `ready()`, `isOpen()`, `state`, and awaitable `close()`.
- Added bounded WebSocket shutdown, abort support, normalized events, and `ResponsesError` handling.
- Added HTTP and WebSocket callbacks, injectable WebSocket implementations, and deterministic mock transport support.
- Added tool, MCP, reasoning, shell-call, and output-item streaming support and documentation.
- Expanded TypeScript declarations, examples, and tests.

## 1.1.8 — 2026-08-06

- Removed the remaining Istanbul coverage-ignore directive from the WebSocket adapter and tested for full natural coverage.

## 1.1.7 — 2026-08-06

- Added selectable HTTP and Responses WebSocket transports, streaming, queue, TypeScript, examples, and compatibility support.

## 1.1.6 — 2026-08-06

- Fixed Azure example linting and environment checks.

## 1.1.5 — 2026-08-06

- Added manual workflow dispatch support, full SDK option passthrough, Azure client support, validation, declarations, documentation, and tests.

## 1.1.4 — 2026-08-06

- Added standardized Oxlint command and Node.js 26 maintenance updates.

## 1.1.3 — 2026-08-06

- Standardized Node.js 26 CI, coverage scripts, AgentX ignore rules, dependencies, and lockfiles.

## 1.1.2 — 2026-07-01

- Version 1.1.2 release.

## 1.1.1 — 2025-12-09

- Version 1.1.1 release.

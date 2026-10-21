# Release Notes

## 15.0.0 — 2026-10-21

### Added

- Add the `logger` client option for structured HTTP and WebSocket operation records.
- Return `response.incomplete` events to stream consumers.
- Return incomplete response data from non-stream `create` calls.

### Changed

- Update the OpenAI SDK, Eliware Test, Eliware Log, and other package dependencies.
- Align package metadata and specifications with Eliware Conventions 13 and 15.
- Use the canonical npm publishing workflow and align Knit deployment steps.
- Keep full Git history in CI so release checks can compare tags.
- Expand end-user guides and rewrite maintained documentation with ASD-STE100 rules.
- Organize socket, request, callback, pricing, and usage helpers with matching tests.
- Consolidate client integration tests and remove redundant workflow specifications.

### Fixed

- Include raw events and normalized response and request IDs in WebSocket callbacks.
- Preserve provider details in WebSocket `ResponsesError` values.
- Use a separate abort signal for each `ready()` call.
- Return an awaitable result from repeated `close()` calls.

## 12.0.0 — 2026-10-12

### Breaking changes

- Remove the `responses-ws` alias and Azure-specific client setup.
- Reject concurrent WebSocket response requests.
- Stop automatic WebSocket reconnect and request replay after interruption.
- Require a Node-compatible WebSocket constructor. Do not support the browser-native constructor.

### Added

- Add standard token cost estimates for GPT-5.6 Luna, Terra, and Sol and GPT-6 Astra, Sol, 6.1 Sol, and Luna.
- Add usage normalization, cost breakdowns, and model cost totals.
- Add HTTP and WebSocket event helpers, callbacks, normalized events, and typed errors.
- Add WebSocket lifecycle methods, abort support, mid-response steering, and response continuation.
- Add GPT-6 async function tool types through the official SDK.
- Add TypeScript declarations and runnable examples for HTTP, WebSocket, pricing, and GPT-6 features.

### Changed

- Move public runtime and declaration entrypoints under `src/`.
- Apply the 272,000-token long-context policy and the 1.25 cache-write multiplier to estimates.
- Keep WebSocket shutdown awaitable and bounded.
- Align package metadata, release workflows, validation, and package files with Eliware conventions.
- Expand end-user guides and examples for setup, pricing, transports, and troubleshooting.

### Fixed

- Preserve raw event data and available response and request IDs.
- Normalize HTTP and WebSocket failures as `ResponsesError` values.
- Reject invalid usage data, unsupported pricing models, and concurrent WebSocket requests.
- Include normalized metadata in steering callbacks and provider details in failure errors.
- Give each `ready()` call its own abort signal and keep repeated `close()` calls awaitable.

### Migration

- Select WebSocket transport with `transport: "websocket"`.
- Remove `responses-ws` and Azure-specific setup from client code.
- Stop relying on automatic WebSocket reconnect or request replay.
- Read the [GPT-6 migration guide](https://developers.openai.com/api/docs/guides/latest-model) for request limits.

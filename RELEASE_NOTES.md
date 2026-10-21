# Release Notes

## 14.0.0 — 2026-10-21

### Added

- Add an injectable structured logger for HTTP and WebSocket Responses operations.

### Changed

- Update the OpenAI SDK to its latest release.
- Align package metadata and specifications with Eliware Convention 14.0.
- Update Eliware Test to its latest release.
- Organize helper modules and tests in matching folders.
- Use the canonical npm workflow and the required Knit command sequence.

### Fixed

- Include normalized fields in WebSocket callback events.
- Preserve provider details in WebSocket failure errors.
- Give each `ready()` call its own abort signal.
- Return a promise from repeated `close()` calls.
- Remove STE wording issues from guides and project instructions.

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

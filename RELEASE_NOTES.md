# Release Notes

## 1.1.3 — Current changes

- Standardized Node.js 26 CI workflow.
- Normalized Jest coverage and gap-testing scripts.
- Added AgentX artifact ignore rules.
- Updated dependencies and lockfiles.

## Version history

- `1.1.1` — Version 1.1.1 - 12-09-2025.
- `1.1.2` — Version 1.1.2 - 07-01-2026.


## 1.1.4

- Added the standardized Oxlint command.
- Updated package metadata and lockfiles for the latest maintenance pass.
- Synchronized the package with the current Eliware Node.js 26 workflow conventions.

## 1.1.5

- Added manual GitHub Actions workflow dispatch support.
- Added full OpenAI SDK option passthrough while preserving API-key string compatibility.
- Added `createAzureOpenAI()` with environment-variable configuration support.
- Added validation for API keys, Azure endpoints, and API versions.
- Updated TypeScript declarations, README documentation, and usage examples.
- Expanded tests to maintain 100% coverage across all metrics.

## 1.1.6

- Fixed the Azure example’s unused import lint warning.
- Made the Azure example run only when the required Azure environment variables are configured.
- Confirmed clean linting and 100% test coverage.
## 1.1.7

- Added selectable HTTP and Responses WebSocket transports.
- Added streaming and non-streaming Responses API support over WebSockets.
- Added configurable WebSocket reconnect and queue options.
- Preserved Responses helpers and resources when using WebSocket transport.
- Added TypeScript definitions for transport selection and WebSocket compatibility APIs.
- Added the `ws` dependency and included examples in the published package.
- Reorganized examples for HTTP, Azure, HTTP streaming, WebSocket, and WebSocket streaming usage.
- Expanded tests to 100% coverage across statements, branches, functions, and lines.
- Added project guidance in `AGENTS.md`.


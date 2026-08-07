# AGENTS.md

## Project

`@eliware/openai` is an ESM-first, TypeScript-ready wrapper around the official OpenAI Node.js SDK.

## Development

- Use Node.js 26 and npm.
- Run `npm install` after dependency changes.
- Run `npm test` for the Jest suite and coverage.
- Run `npm run test:gaps` to inspect uncovered coverage.
- Run `npm run lint`; it must finish with zero warnings and errors.
- Do not commit secrets, `.env` files, coverage output, or `node_modules`.

## Architecture

- Keep the wrapper thin and preserve official SDK option passthrough.
- HTTP is the default transport.
- Responses WebSocket support is selected with `transport: 'websocket'` or `transport: 'responses-ws'`.
- Keep HTTP and WebSocket Responses calls compatible for streaming and non-streaming usage.
- Preserve normalized event metadata: `raw`, `responseId`, and `requestId`.
- Normalize protocol and transport failures as `ResponsesError` with available server metadata.
- WebSocket clients must be explicitly closed during shutdown with `await responses.close()`.
- Close supports bounded shutdown: `responses.close({ timeout })`.
- WebSocket readiness APIs are `ready()`, `isOpen()`, and `state`.
- Abort signals must work for streaming and non-streaming Responses calls.
- Callback APIs include the second `create()` argument and `createWithEvents()`.
- Preserve AgentX-compatible callbacks, including lifecycle, text, item, completion, and error callbacks.
- `WebSocketImpl` and `url` are injectable for tests and alternate runtimes.
- `createMockResponsesTransport()` is the supported deterministic WebSocket test helper.
- Tool, MCP, shell-call, reasoning, text, and output-item events remain protocol events; the library does not execute tools or persist tool state.
- Update `index.d.ts`, README/examples, release notes, and tests when changing the public API.

## Testing

- Prefer focused unit tests with mocked transports.
- Maintain 100% statements, branches, functions, and lines coverage without Istanbul ignore directives, except the barrel file if unavoidable.
- Inspect `coverage/coverage-final.json` before fixing coverage gaps.
- Live API smoke tests require an explicitly supplied credential and must never commit credentials or output containing secrets.

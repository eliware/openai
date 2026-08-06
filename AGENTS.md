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
- Keep HTTP and WebSocket Responses calls compatible for both streaming and non-streaming usage.
- WebSocket clients must be explicitly closed during shutdown with `responses.close()`.
- Update `index.d.ts`, README examples, and tests when changing the public API.

## Testing

Prefer focused unit tests with mocked transports. Live API smoke tests require an explicitly supplied credential and must never commit credentials or output containing secrets.

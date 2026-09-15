# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/openai [![npm version](https://img.shields.io/npm/v/@eliware/openai.svg)](https://www.npmjs.com/package/@eliware/openai)[![license](https://img.shields.io/github/license/eliware/openai.svg)](LICENSE)[![build status](https://github.com/eliware/openai/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/openai/actions)

Documentation: [docs](docs/README.md) · [specifications](specs/README.md) · [examples](examples/README.md)

> A simple OpenAI API client wrapper for Node.js, with ESM and TypeScript support.

Maintained by Eliware <eliware@eliware.org>.

Copyright (c) 2026 Eliware.

## Attribution

This package is maintained and published by Eliware <eliware@eliware.org>.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Pricing](#pricing)
- [API](#api)
- [TypeScript](#typescript)
- [Validation](#validation)
- [Documentation](#documentation)
- [License](#license)

## Features

- Minimal wrapper for the official OpenAI Node.js SDK
- ESM-first and TypeScript-ready
- Simple API key management (environment or parameter)
- Full OpenAI SDK option passthrough, including endpoints, timeouts, retries, and custom fetch
- Selectable HTTP or Responses WebSocket transport
- Streaming and non-streaming Responses API calls
- Bounded WebSocket queueing with explicit shutdown
- Example usage and tests included

## Requirements

- Node.js 26 or newer
- An OpenAI API key for OpenAI usage

## Installation

```bash
npm install @eliware/openai
```

## Usage

```js
import { createOpenAI } from '@eliware/openai';

(async () => {
  // Optionally pass your API key, or set OPENAI_API_KEY in your environment
const openai = createOpenAI();
  // Example: list models
  // const models = await openai.models.list();
  // console.log(models);
})();
```

## Configuration

Set `OPENAI_API_KEY` in a local `.env` file or the process environment, or
pass `apiKey` directly to `createOpenAI()`. Never commit `.env` files or real
credentials. The complete local environment contract is documented in
[`.env.example`](.env.example).

### Pricing

The pricing API supports the GPT-5.6 Luna, Terra, and Sol models. It accepts
Responses API usage objects and applies the shared long-context and cache-write
policies used by the Eliware tools:

The catalog covers standard text-token pricing only. Fast service-tier pricing,
hosted-tool call fees, batch pricing, and image or other modality-specific
charges are outside this module’s scope.

```js
import { calculateUsageCostBreakdown } from '@eliware/openai';

const cost = calculateUsageCostBreakdown('gpt-5.6-luna', response.usage);
console.log(cost.estimated_cost_usd, cost.output_cost_usd);
```

Use `createPricingAccumulator()` to aggregate multiple requests and retain
per-model totals:

```js
import { createPricingAccumulator } from '@eliware/openai';

const totals = createPricingAccumulator();
totals.add('gpt-5.6-luna', response.usage);
console.log(totals.summary());
```

## API

### `createOpenAI(options?: string | OpenAIOptions): OpenAIClient`

Creates and returns a new OpenAI client instance. Pass an API key string for compatibility, or an options object accepted by the official SDK. The API key defaults to `OPENAI_API_KEY`.

```js
createOpenAI('sk-...');
createOpenAI({ apiKey: 'sk-...', baseURL: 'https://api.example.test/v1', timeout: 30_000, maxRetries: 3 });
```

### WebSocket Responses transport

HTTP is the default. Select the Responses WebSocket transport when needed:

```js
const openai = createOpenAI({
  apiKey: 'sk-...',
  transport: 'websocket',
});

const response = await openai.responses.create({ model: 'gpt-5.6-luna', input: 'Hello' });
const events = openai.responses.stream({ model: 'gpt-5.6-luna', input: 'Hello' });
for await (const event of events) console.log(event);

await openai.responses.close();
```

Version 2 supports one in-flight WebSocket response request per client.
Concurrent requests reject explicitly to prevent response-event cross-talk.

The WebSocket adapter also exposes a transport-neutral event iterator. Use `events()` when you need protocol events without collecting a final response:

```js
const events = openai.responses.events({ model: 'gpt-5.6-luna', input: 'Hello' }, { signal });
for await (const event of events) console.log(event);
```

`create()` and `stream()` accept `{ signal }`. Completed responses resolve normally; failed, incomplete, socket-error, and premature-close events reject with `ResponsesError`, which preserves the original event and available error metadata. `responses.close()` is awaitable and bounded; use `await responses.close({ timeout: 30_000 })` to control the shutdown deadline. On timeout it terminates the socket when supported and rejects with `ResponsesError`.

Callbacks are available through `createWithEvents()` (and the second argument to `create()`) without changing the normal event iterator API. AgentX-compatible lifecycle callbacks include `onResponseCreated`, `onResponseProgress`, `onContentPartAdded`, `onContentPartDone`, `onTextDone`, and `onResponseCompleted`:

```js
await openai.responses.createWithEvents(request, {
  onEvent: (event, raw) => {},
  onResponseCreated: (response, event) => {},
  onResponseProgress: (response, event) => {},
  onContentPartAdded: (part, event) => {},
  onContentPartDone: (part, event) => {},
  onTextDelta: (delta, event) => {},
  onItemAdded: (item, event) => {},
  onItemDone: (item, event) => {},
  onTextDone: (text, event) => {},
  onCompleted: (response, event) => {},
  onResponseCompleted: (response, event) => {},
  onError: (error, event) => {},
});
```

For deterministic tests, `createMockResponsesTransport(events)` returns an injectable WebSocket implementation. It accepts optional `{ autoOpen, delay, events }` options; the event list can include text, function/shell/MCP argument deltas, reasoning summaries, output items, terminal events, and arbitrary socket scenarios. The returned fake exposes `push()`, `error()`, `sent`, and `instances` for deterministic lifecycle tests.

For Node-compatible custom transports, provide `WebSocketImpl` and optionally `url` in the client options. The constructor receives `(url, { headers })`; browser-native WebSocket constructors are not supported directly. The adapter exposes `await responses.ready()`, `responses.isOpen()`, and `responses.state` (`connecting`, `open`, `closing`, or `closed`). Events include `raw`, `responseId`, and `requestId` when supplied by the server.

The WebSocket adapter also supports the familiar `responses.stream()` helper and preserves `inputItems` and `inputTokens` resources. The connection remains available while the client is retained. The WebSocket adapter
continues to expose HTTP Responses helpers such as `retrieve`, `delete`, `cancel`, and
`parse`. Call `responses.close()` during shutdown.

Both helpers throw clear errors when required configuration is missing.

## Errors / Troubleshooting

`createOpenAI` requires an API key from `apiKey` or `OPENAI_API_KEY`. Transport, timeout, retry, abort, and WebSocket shutdown errors preserve available upstream context. Always await `responses.close()` for WebSocket clients.

## Validation

```bash
npm test
npm run lint
```

## Documentation

- [User documentation](docs/README.md)
- [Specifications](specs/README.md)
- [Examples](examples/)
- [Release notes](RELEASE_NOTES.md)

## Security

Treat API keys and endpoint credentials as secrets. Store them in environment variables or a secret manager; never commit `.env` files, log credentials, or expose keys in examples.

## TypeScript

Type definitions are included:

```ts
import type OpenAI from 'openai';
import { createOpenAI } from '@eliware/openai';
const openai: import('@eliware/openai').OpenAIClient = createOpenAI();
```

## Support

For help, questions, or to chat with the Eliware team and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## License

[MIT © Eliware](LICENSE)

## Links

- [Home Page](https://eliware.org)
- [GitHub](https://github.com/eliware/openai)
- [npm](https://www.npmjs.com/package/@eliware/openai)
- [Discord](https://discord.gg/M6aTR9eTwN)

#### Tool and item streaming

The event iterator and callbacks preserve protocol event types. TypeScript consumers
can use the exported `ResponsesEvent` union and narrow on `event.type`.

Handle these tool/event families in the iterator or `onEvent` callback:

- `response.output_item.added` / `response.output_item.done`
- `response.function_call_arguments.delta` / `.done`
- `response.shell_call_command.delta` / `.done`
- `response.custom_tool_call_input.delta` / `.done`
- `response.mcp_call_arguments.delta` / `.done`
- reasoning summary/text delta and done events
- text delta/done events

Accumulate argument/input deltas by output-item ID. On the corresponding `.done` event,
parse the completed arguments, execute or confirm the tool in the application, then
submit its output with a new Responses request using `previous_response_id`. This
library does not execute tools, handle confirmations, or persist tool state.

`raw` contains the original transport event. `responseId` and `requestId` are populated
when supplied by the server. Error events preserve the original event and available
`code`, `type`, `status`, `parameter`, `requestId`, and `cause` metadata. `onError` is
called for protocol failures, socket failures, premature close, abort, and stream
exhaustion.

### Event and error contract

WebSocket lifecycle events (`connecting`, `open`, `close`, and `error`) are transport events.
Reconnect is not performed by the 2.0 adapter; an interruption fails the active request.
Response protocol events are yielded
with their original `type`, plus `raw`, `responseId`, and `requestId` when available.
`ResponsesError` preserves the originating event and exposes `code`, `type`, `status`,
`parameter`, `requestId`, and `cause` where available. Always await `responses.close()`
during shutdown.

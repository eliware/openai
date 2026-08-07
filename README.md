# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/openai [![npm version](https://img.shields.io/npm/v/@eliware/openai.svg)](https://www.npmjs.com/package/@eliware/openai)[![license](https://img.shields.io/github/license/eliware/openai.svg)](LICENSE)[![build status](https://github.com/eliware/openai/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/openai/actions)

> A simple OpenAI API client wrapper for Node.js, with ESM and TypeScript support.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [TypeScript](#typescript)
- [License](#license)

## Features

- Minimal wrapper for the official OpenAI Node.js SDK
- ESM-first and TypeScript-ready
- Simple API key management (environment or parameter)
- Full OpenAI SDK option passthrough, including endpoints, timeouts, retries, and custom fetch
- Azure OpenAI client helper with environment-variable support
- Selectable HTTP or Responses WebSocket transport
- Streaming and non-streaming Responses API calls
- Configurable WebSocket reconnect behavior and queueing
- Example usage and tests included

## Installation

```bash
npm install @eliware/openai
```

## Usage

```js
import { createOpenAI } from '@eliware/openai';

(async () => {
  // Optionally pass your API key, or set OPENAI_API_KEY in your environment
  const openai = await createOpenAI();
  // Example: list models
  // const models = await openai.models.list();
  // console.log(models);
})();
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
  reconnect: { maxRetries: 5 },
});

const response = await openai.responses.create({ model: 'gpt-5.6-luna', input: 'Hello' });
const events = openai.responses.stream({ model: 'gpt-5.6-luna', input: 'Hello' });
for await (const event of events) console.log(event);

await openai.responses.close();
```

The WebSocket adapter also exposes a transport-neutral event iterator. Use `events()` when you need protocol events without collecting a final response:

```js
const events = openai.responses.events({ model: 'gpt-5.6-luna', input: 'Hello' }, { signal });
for await (const event of events) console.log(event);
```

`create()` and `stream()` accept `{ signal }`. Completed responses resolve normally; failed, incomplete, socket-error, and premature-close events reject with `ResponsesError`, which preserves the original event and available error metadata. `responses.close()` is awaitable.

Callbacks are available through `createWithEvents()` (and the second argument to `create()`). AgentX-compatible lifecycle callbacks include `onResponseCreated`, `onResponseProgress`, `onContentPartAdded`, `onContentPartDone`, `onTextDone`, and `onResponseCompleted`. without changing the normal event iterator API:

```js
await openai.responses.createWithEvents(request, {
  onEvent: event => {},
  onTextDelta: (delta, event) => {},
  onItemAdded: (item, event) => {},
  onItemDone: (item, event) => {},
  onCompleted: (response, event) => {},
  onError: (error, event) => {},
});
```

For deterministic tests, `createMockResponsesTransport(events)` returns an injectable WebSocket implementation. It accepts optional `{ autoOpen, delay, events }` options; the event list can include text, function/shell/MCP argument deltas, reasoning summaries, output items, terminal events, and arbitrary socket scenarios. The returned fake exposes `push()`, `error()`, `reconnect()`, `sent`, and `instances` for deterministic lifecycle tests.

For tests or alternate runtimes, provide `WebSocketImpl` and optionally `url` in the client options. The adapter exposes `await responses.ready()`, `responses.isOpen()`, and `responses.state` (`connecting`, `open`, `closing`, or `closed`). Events include `raw`, `responseId`, and `requestId` when supplied by the server.

The WebSocket adapter also supports the familiar `responses.stream()` helper and preserves `inputItems` and `inputTokens` resources. The connection remains available while the client is retained. Automatic reconnect is opt-in: configure it with `reconnect`. The WebSocket adapter
continues to expose HTTP Responses helpers such as `retrieve`, `delete`, `cancel`, and
`parse`. Call `responses.close()` during shutdown.

### `createAzureOpenAI(options?: AzureOpenAIOptions): OpenAIClient`

Creates an Azure OpenAI client. Options may include `apiKey`, `endpoint`, `apiVersion`, and `deployment`; these default to `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`, and `OPENAI_API_VERSION`.

```js
const openai = createAzureOpenAI({ deployment: 'gpt-5.6-luna' });
```

Both helpers throw clear errors when required configuration is missing.

## TypeScript

Type definitions are included:

```ts
import { createOpenAI } from '@eliware/openai';
import type OpenAI from 'openai';
import { createOpenAI, createAzureOpenAI } from '@eliware/openai';
const openai: import('@eliware/openai').OpenAIClient = createOpenAI();
const azure: import('@eliware/openai').OpenAIClient = createAzureOpenAI();
```

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## License

[MIT © 2025 Eli Sterling, eliware.org](LICENSE)

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

WebSocket lifecycle events (`connecting`, `open`, `reconnecting`, `reconnected`,
`close`, and `error`) are transport events. Response protocol events are yielded
with their original `type`, plus `raw`, `responseId`, and `requestId` when available.
`ResponsesError` preserves the originating event and exposes `code`, `type`, `status`,
`parameter`, `requestId`, and `cause` where available. Always await `responses.close()`
during shutdown.

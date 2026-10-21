# Configuration

Use Node.js 26 or later with native ESM. Install `@eliware/openai` with npm.

## API key

Set `OPENAI_API_KEY` in the process environment. You can also pass `apiKey` to `createOpenAI()`.
The `apiKey` option replaces the environment value.

```js
import { createOpenAI } from "@eliware/openai";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

You can pass the key as a string when you use default options.

```js
const openai = createOpenAI(process.env.OPENAI_API_KEY);
```

The package rejects a missing, empty, or whitespace-only key.

## Client options

Pass SDK options in an object. The package sends standard OpenAI SDK options to the SDK.
The wrapper handles the options in this table.

| Option          | Use                                                               |
| --------------- | ----------------------------------------------------------------- |
| `apiKey`        | Set the API key.                                                  |
| `transport`     | Select `"http"` or `"websocket"`. The default is `"http"`.        |
| `logger`        | Send structured operation records to a Winston-compatible logger. |
| `WebSocketImpl` | Set a Node-compatible WebSocket constructor.                      |
| `url`           | Set a custom WebSocket endpoint.                                  |
| `maxQueueSize`  | Set the outgoing WebSocket queue limit in bytes.                  |

For example, set SDK timeout and retry options with the API key.

```js
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30_000,
  maxRetries: 2,
});
```

Read the [OpenAI SDK documentation](https://github.com/openai/openai-node) for SDK options.

## Structured logger

Install `@eliware/log` as a direct dependency when your application creates a logger.

```sh
npm install @eliware/log
```

Create a logger and pass it to `createOpenAI()`.

```js
import { createLogger } from "@eliware/log";
import { createOpenAI } from "@eliware/openai";

const logger = createLogger({ format: "json", level: "debug" });
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY, logger });
```

The package writes structured records for request starts, completions, failures, and stream event types.
It does not log request input, response content, API keys, or credentials.

The logger supports `error`, `warn`, `info`, `http`, `verbose`, `debug`, and `silly` levels.
Set `level` to select the lowest level that the logger writes.
The public `OpenAILogger` type describes the logger option.

## WebSocket options

Set `transport: "websocket"` to use the Responses WebSocket transport.
The SDK limits queued outgoing messages to 1 MiB by default while the socket connects.
Set `maxQueueSize` to change that byte limit.

Set `WebSocketImpl` to use a custom Node-compatible WebSocket constructor.
The constructor must accept a URL and an options object with `headers`.
Set `url` only when a custom endpoint is necessary, such as a test server.
See [Transport details](transports.md).

## Keep credentials private

Keep API keys and private endpoints out of source control.
Store local values in an ignored `.env` file or a secret manager.
Use `.env.example` only for safe placeholders.

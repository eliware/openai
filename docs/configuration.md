# Configuration

## API key

Set `OPENAI_API_KEY` in the process environment or pass `apiKey` to `createOpenAI()`. The client needs a non-empty API key.

```js
import { createOpenAI } from "@eliware/openai";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

You can also pass the API key as a string:

```js
const openai = createOpenAI(process.env.OPENAI_API_KEY);
```

## SDK options

Pass official OpenAI SDK options as an object. The package sends those options to the SDK.

```js
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30_000,
  maxRetries: 2,
});
```

See the [OpenAI SDK docs](https://github.com/openai/openai-node) for SDK options.

## Logger

Pass a logger that `@eliware/log` creates to record Responses operations. The package writes structured records for request starts, completions, failures, and stream event types.

```js
import { createLogger } from "@eliware/log";
import { createOpenAI } from "@eliware/openai";

const logger = createLogger({ format: "json", level: "debug" });
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY, logger });
```

The logger supports `error`, `warn`, `info`, `http`, `verbose`, `debug`, and `silly` levels. Set `level` to control the minimum level that the logger writes. The package does not log request input, API keys, or response content.

## WebSocket options

Set `transport: "websocket"` to select the Responses WebSocket transport. You can set `WebSocketImpl` to a Node-compatible WebSocket constructor and `url` to a WebSocket endpoint.

Use `WebSocketImpl` and `url` for tests or a different runtime. See [transport details](transports.md).

## Keep keys private

Keep API keys and private endpoints out of source control. Store local values in an ignored `.env` file or a secret manager. Use `.env.example` only for safe placeholders.

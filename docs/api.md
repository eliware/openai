# API

Import runtime functions and TypeScript types from the `@eliware/openai` package root.
The package uses native ESM and the official OpenAI Node.js SDK.

## Create a client

Install `@eliware/openai` and set an API key. Call `createOpenAI()` to create a client.

```js
import { createOpenAI } from "@eliware/openai";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await openai.responses.create({
  model: "gpt-6-luna",
  input: "Summarize the purpose of this package.",
});
console.log(response.output_text);
```

Pass the API key as a string when you do not require other options.
Set `OPENAI_API_KEY` to use the environment value.
Pass `apiKey` to override the environment value.
See [Configuration](configuration.md) for all wrapper options.

## HTTP Responses methods

HTTP is the default transport. The client keeps the official SDK Responses methods.
The wrapper adds callback support and these stream helpers.

| Method                              | Result                                                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `create(input, options)`            | Return a response promise, or an async event stream when `stream` is `true`.                                |
| `createWithEvents(input, handlers)` | Return the response promise. Consume a stream and resolve without a response when `input.stream` is `true`. |
| `events(input, options)`            | Return an async event stream.                                                                               |
| `stream(input, options)`            | Return an async event stream.                                                                               |

Pass request fields in `input`.
Pass callbacks and `signal` in `options` to keep helper settings separate from API request fields.
The wrapper also reads callback fields from `input`.

```js
const response = await openai.responses.create(
  { model: "gpt-6-luna", input: "Count to three." },
  { onCompleted: (result) => console.log(result.output_text) },
);
```

Use `stream: true` to read events as the API sends them.

```js
for await (const event of openai.responses.stream({
  model: "gpt-6-luna",
  input: "Count to three.",
})) {
  if (event.type === "response.output_text.delta") process.stdout.write(event.delta);
}
```

## Callbacks and events

Pass these callbacks in `options` or in the request input.

| Callback              | Value                                           |
| --------------------- | ----------------------------------------------- |
| `onEvent`             | Receive the normalized event and its raw event. |
| `onResponseCreated`   | Receive a response when it starts.              |
| `onResponseProgress`  | Receive a response when it enters progress.     |
| `onContentPartAdded`  | Receive a content part when it starts.          |
| `onContentPartDone`   | Receive a content part when it ends.            |
| `onTextDelta`         | Receive each text delta.                        |
| `onTextDone`          | Receive completed text.                         |
| `onItemAdded`         | Receive an output item when it starts.          |
| `onItemDone`          | Receive an output item when it ends.            |
| `onCompleted`         | Receive the completed response.                 |
| `onResponseCompleted` | Receive the completed response.                 |
| `onError`             | Receive an error and its event.                 |

`onEvent` receives `(normalizedEvent, rawEvent)`.
Each event-specific callback receives `(value, normalizedEvent)`.
The normalized event can include `raw`, `responseId`, and `requestId` fields.
`onCompleted` and `onResponseCompleted` receive the same completed response.

The wrapper calls `onTextDelta` for `response.output_text.delta` events.
It calls `onCompleted` and `onResponseCompleted` for `response.completed` events.
It calls `onError` when a request or stream fails.

## WebSocket Responses methods

Set `transport: "websocket"` to select the WebSocket client.
The client also provides these methods.

| Method                                         | Use                                                                                |
| ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| `create(input, options)`                       | Return a response promise, or an async event stream when `stream` is `true`.       |
| `createWithEvents(input, handlers)`            | Return the response promise, or consume the stream and resolve without a response. |
| `events(input, options)`                       | Return an async event stream.                                                      |
| `stream(input, options)`                       | Return an async event stream.                                                      |
| `steer(previousResponseId, input)`             | Send more input to the current response.                                           |
| `continueResponse(input)`                      | Continue after a matching `response.steer.pending` event.                          |
| `ready(signal)`                                | Wait for the socket to open.                                                       |
| `isOpen()`                                     | Return `true` if the socket is open.                                               |
| `state`                                        | Read `connecting`, `open`, `closing`, or `closed`.                                 |
| `close(options)`                               | Close the socket and return a promise.                                             |
| `on(name, listener)` and `off(name, listener)` | Add or remove a socket event listener.                                             |

One response request can run at a time on each WebSocket client.
The client does not reconnect or replay a request after a connection failure.
See [Transport details](transports.md) for socket behavior and steering examples.

## Pricing methods

The package exports these pricing functions and constants.

| Export                                      | Use                                                          |
| ------------------------------------------- | ------------------------------------------------------------ |
| `getPricing(model)`                         | Read rates for a supported model.                            |
| `API_PRICING`                               | Read the full supported model catalog.                       |
| `normalizeUsage(usage)`                     | Validate and normalize Responses API usage.                  |
| `calculateUsageCost(model, usage)`          | Return an estimated total in USD.                            |
| `calculateUsageCostBreakdown(model, usage)` | Return token counts, cost fields, and the long-context flag. |
| `createPricingAccumulator()`                | Add requests and read totals by model.                       |
| `LONG_CONTEXT_INPUT_THRESHOLD`              | Read the token count that starts long-context pricing.       |
| `LONG_CONTEXT_INPUT_MULTIPLIERS`            | Read the input and output long-context multipliers.          |

See [Pricing](pricing.md) for model rates, input fields, and estimate limits.

## Function tools

The client accepts Responses API tool parameters through the official SDK.
Use the async function tool example to read tool calls, run application code, and send function outputs.
See [the async tool example](../examples/gpt-6-async-tool.mjs).

## Errors and types

Transport failures use `ResponsesError`.
The error can include `event`, `code`, `type`, `status`, `parameter`, `requestId`, and `cause` fields.
Call `eventErrorDetails(event)` to read normalized error fields.

`normalizeEvent(event)` adds raw event data and available response and request IDs.
The package also exports `ResponsesEvent`, request and response types, callback option types,
`OpenAIOptions`, `OpenAILogger`, and client types.
See [the type declarations](../src/index.d.ts) for exact definitions.

## Advanced entrypoints

The package root exports `createHTTPResponsesAdapter()`,
`createMockResponsesTransport()`, and `ResponsesWebSocketAdapter`.
Use these exports when you must connect a Responses adapter or a test transport directly.

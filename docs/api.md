# API

Import public names from `@eliware/openai`. The package uses native ESM. TypeScript names come from the package root.

## Create a client

Call `createOpenAI(options)` to create a client. Pass an API key string or an options object. Set `apiKey` in the object or set `OPENAI_API_KEY` in the process environment.

The client accepts the official OpenAI SDK options. It also accepts `transport`, `logger`, `maxQueueSize`, `WebSocketImpl`, and `url`.

Set `transport` to `"http"` or `"websocket"`. The default is `"http"`. See the [transport guide](transports.md) for WebSocket limits.

Pass a logger created by `@eliware/log` with `logger`. The package writes structured records for request starts, completions, failures, and stream event types. It does not log request input, credentials, or response content. The `OpenAILogger` type describes the logger option.

## HTTP Responses methods

The HTTP client keeps the official SDK Responses methods. It adds `create`, `createWithEvents`, `events`, and `stream`.

- Call `create(input, options)` for a response or an async event stream.
- Set `input.stream` to `true` to make `create` return an async event stream.
- Call `createWithEvents(input, handlers)` to receive a response and callbacks.
- Set `input.stream` to `true` with `createWithEvents()` to consume events and resolve after the stream ends.
- Call `events(input, options)` or `stream(input, options)` to read an async event stream.
- Pass request options in `input`. Pass callbacks and an `AbortSignal` in `options`.

The callbacks include `onEvent`, `onResponseCreated`, `onResponseProgress`, `onContentPartAdded`, `onContentPartDone`, `onTextDelta`, `onTextDone`, `onItemAdded`, `onItemDone`, `onCompleted`, `onResponseCompleted`, and `onError`.

Each callback receives the event data first and a normalized event second. The normalized event keeps raw data and available response and request IDs.

## WebSocket Responses methods

The WebSocket client adds `create`, `createWithEvents`, `events`, `stream`, `steer`, `continueResponse`, `ready`, `isOpen`, `state`, and `close`.

- Call `create(input, options)` for a response or set `input.stream` to `true` for an async event stream.
- Call `createWithEvents(input, handlers)` to receive a response and callbacks.
- Set `input.stream` to `true` with `createWithEvents()` to consume events and resolve after the stream ends.
- Call `events(input, options)` or `stream(input, options)` to read an async event stream.
- Call `ready()` to wait for the socket to open. Check `isOpen()` or `state` to read its state.
- Call `close()` and await its promise when the client no longer needs the socket.
- Call `steer(previousResponseId, input)` during the active response. Use a string or a non-empty input array.
- Call `continueResponse(input)` after a `response.steer.pending` event. Set the matching `previous_response_id`.

One response request can run at a time on each WebSocket client. The client does not reconnect or replay a request after a connection failure.

## Pricing methods

- Call `getPricing(model)` to read a model's token rates.
- Call `normalizeUsage(usage)` to validate and normalize Responses API usage.
- Call `calculateUsageCost(model, usage)` to calculate the estimated USD cost.
- Call `calculateUsageCostBreakdown(model, usage)` to return token counts and cost fields.
- Call `createPricingAccumulator()` to add requests and read totals with `summary()`.

See the [pricing guide](pricing.md) for supported models, rates, and limits.

## Errors and types

Transport failures use `ResponsesError`. It can include `event`, `code`, `type`, `status`, `parameter`, `requestId`, and `cause` fields.

The package exports request, response, event, transport, pricing, and client types. It also exports `eventErrorDetails`, `normalizeEvent`, `API_PRICING`, and `LONG_CONTEXT_INPUT_THRESHOLD`.

See the [type declarations](../src/index.d.ts) for exact type definitions.

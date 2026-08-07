# AgentX migration request

Hi Eliware OpenAI developer,

I want to migrate AgentX CLI from its custom Responses WebSocket transport to `@eliware/openai`. Your library is the right direction: it wraps the official SDK, supports Responses WebSocket transport, reconnects, streaming, and explicit shutdown.

To make the migration straightforward and safe, AgentX needs the following improvements:

## Required

### 1. Streaming event callbacks

AgentX currently renders events while a response is in progress. Please support callbacks on `responses.create()` or provide an equivalent helper:

```js
await openai.responses.create(request, {
  onEvent(event),
  onTextDelta(delta, event),
  onItemAdded(item, event),
  onItemDone(item, event),
  onCompleted(response, event),
  onError(error, event),
});
```

At present, the second argument is ignored by `ResponsesWebSocketAdapter.create()`, so AgentX cannot use its existing live-rendering pipeline.

Preferred alternative:

```js
await openai.responses.createWithEvents(request, handlers);
```

### 2. Consistent terminal behavior

Define and document behavior for all terminal response events:

- `response.completed`
- `response.failed`
- `response.incomplete`
- `error`
- socket close/error

Non-streaming calls should reject with a useful error for failed/incomplete responses rather than resolving `undefined`.

Errors should preserve:

- error code/type
- message
- status
- parameter
- request ID
- original event

### 3. Abort support

Support cancellation for both streaming and non-streaming calls:

```js
responses.create(request, { signal });
responses.stream(request, { signal });
```

AgentX needs this for Ctrl-C, tool cancellation, worker shutdown, and interrupted sessions.

### 4. Deterministic shutdown

Please make shutdown awaitable:

```js
await openai.responses.close();
```

Also expose a readiness/state API if practical:

```js
await openai.responses.ready();
openai.responses.isOpen();
```

### 5. Injectable WebSocket implementation

Allow tests and custom deployments to provide:

```js
createOpenAI({
  apiKey,
  transport: 'websocket',
  WebSocketImpl,
  url,
});
```

This is important for deterministic unit tests without live network access.

## Strongly requested

### 6. Shared event normalization

Export or internally standardize event handling so HTTP and WebSocket Responses calls expose compatible event shapes.

### 7. Preserve metadata

Every yielded/callback event should retain response ID, request ID, raw event data, and server error metadata where available.

### 8. Test helpers

Provide a documented fake Responses WebSocket or test factory covering:

- text deltas
- function/tool calls
- reasoning summaries
- MCP events
- completed responses
- failed/incomplete responses
- reconnects
- close/error behavior

### 9. Document tool-call streaming

Please document the expected handling of:

- function-call argument deltas
- shell-call command deltas
- MCP argument deltas
- output item added/done events
- submitting tool outputs with `previous_response_id`

### 10. Type declarations

Keep callback, event, abort, WebSocket injection, and close APIs represented in `index.d.ts`.

## Why this matters

AgentX should retain ownership of terminal UX, tool execution, confirmation, persistence, usage accounting, and recovery. The library should own SDK transport, WebSocket lifecycle, reconnects, event delivery, and protocol-level errors.

If these APIs are available, the migration can stay small and maintainable. Without them, AgentX must continue carrying a parallel transport adapter and duplicate much of the WebSocket lifecycle logic.

Thanks. We would prefer to depend on the official shared library rather than maintain a competing transport implementation.

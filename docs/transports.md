# Transports

The package uses HTTP by default. Set `transport: "websocket"` to use the Responses WebSocket transport.

## HTTP

The HTTP client uses the official SDK Responses API. It adds `createWithEvents()`, `events()`, and `stream()` helpers. It supports request callbacks and abort signals.

Use HTTP for ordinary requests or when you do not need a persistent socket.

## WebSocket

The WebSocket client supports response events, callbacks, abort signals, and lifecycle methods. Call `ready()` to wait for an open socket. Call and await `close()` at shutdown.

Each client accepts one active response request. A concurrent request fails with `ResponsesError`. The client does not reconnect or replay a request after a connection failure.

The package requires a Node-compatible WebSocket constructor. It does not support the browser-native constructor. Pass `WebSocketImpl` when you need a custom constructor. Set `url` only for a custom endpoint or test.

## Events

Both transports can return normalized Responses events. Each event can include raw event data, `responseId`, and `requestId`.

Pass callbacks such as `onTextDelta`, `onItemDone`, and `onCompleted` in request options. Pass an `AbortSignal` in `signal` to stop a request.

WebSocket steering uses `steer(previousResponseId, input)` during the current response. Continue a response after `response.steer.pending` with `continueResponse()` and its matching `previous_response_id`.

See the [API guide](api.md) for method details and examples.

# Transports

The package uses HTTP by default. Set `transport: "websocket"` to select the Responses WebSocket transport.
Both transports use the official OpenAI SDK and return normalized Responses events from helper methods.

## HTTP

Use HTTP for requests that do not require a long-lived socket.
The client keeps the SDK Responses methods and adds event callbacks and stream helpers.

```js
const response = await openai.responses.create({
  model: "gpt-6-luna",
  input: "Say hello.",
});
console.log(response.output_text);
```

Call `events()` or `stream()` to read events.
Pass `signal` and callbacks in the second argument to stop a request or process events.

```js
const controller = new AbortController();
const events = openai.responses.events(
  { model: "gpt-6-luna", input: "Count to three." },
  { signal: controller.signal, onTextDelta: (text) => process.stdout.write(text) },
);

for await (const event of events) {
  if (event.type === "response.completed") console.log("\nComplete");
}
```

## WebSocket

Use WebSocket for event-driven Responses requests on a long-lived connection.
Set `transport: "websocket"` when you create the client.
Use a Node-compatible WebSocket constructor.
The browser-native constructor is not supported.

```js
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  transport: "websocket",
});

try {
  const response = await openai.responses.create({
    model: "gpt-6-luna",
    input: "Say hello.",
  });
  console.log(response.output_text);
} finally {
  await openai.responses.close();
}
```

Call `ready()` to wait for an open socket.
Read `state` or call `isOpen()` to check its state.
Call and await `close()` when the client no longer uses the socket.
`close()` cancels active streams and waits for the socket to close.
The default close timeout is 30 seconds.

The SDK limits queued outgoing messages to 1 MiB during socket connection.
Set `maxQueueSize` in bytes to change that limit.
Each client accepts one active response request.
The client does not reconnect or replay a request after a connection failure.

## Stream events and callbacks

Call `responses.create(input, options)` with `input.stream: true` to receive an async event stream.
Call `responses.stream(input, options)` or `responses.events(input, options)` to receive a stream without that flag.
Pass callbacks and an `AbortSignal` in `options`.
See [API details](api.md#callbacks-and-events) for callback names and arguments.

## Steer a response

Call `steer(previousResponseId, input)` while the response is active.
Pass the current response ID and a string or a non-empty input array.
The WebSocket client keeps the request open while the API resolves steering.
Send an instruction after the response starts.

```js
const model = "gpt-6-luna";
const input = "Explain the result in detail.";
let sentSteering = false;

for await (const event of openai.responses.stream({ model, input })) {
  if (event.type === "response.created" && !sentSteering) {
    sentSteering = true;
    openai.responses.steer(event.response.id, "Keep the answer concise.");
  }
}
```

## Continue after a pending event

When the stream sends `response.steer.pending`, send the required function output with `continueResponse()`.
Use the matching `previous_response_id` and `call_id` from the active request.

```js
for await (const event of openai.responses.stream({ model, input })) {
  if (event.type === "response.steer.pending") {
    openai.responses.continueResponse({
      previous_response_id: event.steer.previous_response_id,
      input: [{ type: "function_call_output", call_id, output }],
    });
  }
}
```

Set `call_id` to the matching function call ID.
Set `output` to the result from your application function.
See [the async tool example](../examples/gpt-6-async-tool.mjs) for a complete tool flow.

## Custom WebSocket connection

Set `WebSocketImpl` to provide a compatible WebSocket constructor.
The constructor must accept `(url, { headers })` and expose Node-style socket events.
Set `url` to provide a custom WebSocket endpoint.
Use these options for a compatible runtime or a test server.

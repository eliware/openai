# Responses requirements

- HTTP remains the default transport.
- WebSocket transport is selected with `transport: 'websocket'`.
- Streaming and non-streaming calls expose normalized metadata and
  `ResponsesError` failures.
- Abort signals must settle active requests deterministically.
- WebSocket clients expose readiness state and bounded, awaitable shutdown.

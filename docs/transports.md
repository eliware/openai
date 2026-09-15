# Transports

HTTP is the default transport. Select the Responses WebSocket transport with
`transport: 'websocket'`. WebSocket clients expose `ready()`, `isOpen()`, and
`state`, and must be closed with `await responses.close()` during shutdown.

Streaming, non-streaming calls, abort signals, normalized event metadata, and
Responses errors are available through both supported transports.

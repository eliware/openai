# Examples

- [Root README](../README.md)
- [Basic examples](basic/README.md)
- [HTTP example](http.mjs)
- [HTTP streaming example](http-streaming.mjs)
- [WebSocket example](websocket.mjs)
- [WebSocket streaming example](websocket-streaming.mjs)

The runnable `.mjs` files in this directory demonstrate HTTP and WebSocket
usage. Set `OPENAI_API_KEY` in the environment before running them; never put
credentials in the files.

## Prerequisites

Node.js 26 or newer and an OpenAI API key.

## Expected results

Successful request output or streamed response events. Without credentials,
the examples fail with the client configuration error.

## Secret-safe placeholders

Examples use `OPENAI_API_KEY` from the environment and contain no credentials,
tokens, or other secrets.

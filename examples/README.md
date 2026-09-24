# Examples

[Root README](../README.md) · [Basic example](basic/README.md)

Purpose: runnable examples demonstrate this package's HTTP and WebSocket requests, streaming, and GPT-6 tool workflows.

Prerequisites: Node.js 26 or newer, installed dependencies, and `OPENAI_API_KEY` in the environment. Each command runs from the repository root. Expected results are a response or streamed events. Without credentials, the client reports a configuration error. Examples never contain API keys.

The examples use secret-safe placeholders and environment-based credentials only.

Runnable examples:

- [basic](basic/README.md)
- [gpt-6-async-tool.mjs](gpt-6-async-tool.mjs)
- [gpt-6-steering.mjs](gpt-6-steering.mjs)
- [http-streaming.mjs](http-streaming.mjs)
- [http.mjs](http.mjs)
- [websocket-streaming.mjs](websocket-streaming.mjs)
- [websocket.mjs](websocket.mjs)

| Example                                        | Command                                 | Expected result                                                       |
| ---------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| [HTTP](http.mjs)                               | `node examples/http.mjs`                | Prints the response result.                                           |
| [HTTP streaming](http-streaming.mjs)           | `node examples/http-streaming.mjs`      | Prints streamed response events.                                      |
| [WebSocket](websocket.mjs)                     | `node examples/websocket.mjs`           | Prints the response and closes the socket.                            |
| [WebSocket streaming](websocket-streaming.mjs) | `node examples/websocket-streaming.mjs` | Prints streamed events and closes the socket.                         |
| [GPT-6 async tool](gpt-6-async-tool.mjs)       | `node examples/gpt-6-async-tool.mjs`    | Prints tool-call events and submits application-produced tool output. |
| [GPT-6 steering](gpt-6-steering.mjs)           | `node examples/gpt-6-steering.mjs`      | Prints steering and response events.                                  |

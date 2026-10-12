# Examples

Set `OPENAI_API_KEY` before you run an example. Run each command from the repository root.

| Example                                        | Command                                 | Result                                          |
| ---------------------------------------------- | --------------------------------------- | ----------------------------------------------- |
| [GPT-6 async tool](gpt-6-async-tool.mjs)       | `node examples/gpt-6-async-tool.mjs`    | Shows tool-call events and submits tool output. |
| [GPT-6 steering](gpt-6-steering.mjs)           | `node examples/gpt-6-steering.mjs`      | Shows steering and response events.             |
| [HTTP streaming](http-streaming.mjs)           | `node examples/http-streaming.mjs`      | Shows streamed response events.                 |
| [HTTP](http.mjs)                               | `node examples/http.mjs`                | Shows a response.                               |
| [WebSocket streaming](websocket-streaming.mjs) | `node examples/websocket-streaming.mjs` | Shows streamed events and closes the socket.    |
| [WebSocket](websocket.mjs)                     | `node examples/websocket.mjs`           | Shows a response and closes the socket.         |

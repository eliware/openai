# Configuration

Provide `OPENAI_API_KEY` through the process environment or pass `apiKey` to
`createOpenAI()`. Other official SDK options are passed through unchanged.
Use `WebSocketImpl` and `url` only when configuring the WebSocket transport for
tests or an alternate runtime.

Never commit credentials or private endpoints. Start from `.env.example` and
keep local values in an ignored `.env` file or a secret manager.

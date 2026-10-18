# Troubleshooting

## Missing API key

Set `OPENAI_API_KEY` or pass a non-empty `apiKey` to `createOpenAI()`.

## WebSocket close or failure

Call `ready()` before you depend on an open WebSocket. Await `responses.close()` when the client no longer needs the socket.

The client supports one active request for each WebSocket. Start a new request after the active request ends. The client does not reconnect or replay failed requests.

## Request cancellation

Pass an `AbortSignal` in the request options. An abort ends the active request. It does not start a new request.

## Pricing errors

Use one of the model IDs in the [pricing guide](pricing.md). Pass valid, non-negative integer token counts. Cached and cache-write tokens must be no more than input tokens.

## Report an error

`ResponsesError` can contain an event, error code, type, status, parameter, request ID, and cause. Include safe error details in a report. Remove API keys, credentials, and private endpoint data.

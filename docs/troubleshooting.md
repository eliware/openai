# Troubleshooting

Use these checks to resolve common client, transport, logging, and pricing errors.

## Missing API key

Set `OPENAI_API_KEY` in the process environment or pass a non-empty `apiKey` to `createOpenAI()`.
Pass `apiKey` to override the environment value.
The package rejects empty and whitespace-only keys.

## Request or stream error

Catch request errors and inspect the `ResponsesError` fields.
The error can include `event`, `code`, `type`, `status`, `parameter`, `requestId`, and `cause`.
Call `eventErrorDetails(error.event)` to read common error fields.
Remove API keys, credentials, and private endpoint data before you share error details.

## WebSocket connection error

Use a Node-compatible WebSocket constructor.
Set `WebSocketImpl` when your runtime requires a custom constructor.
The constructor must accept `(url, { headers })` and expose Node-style events.
Set `url` only for a custom endpoint or a test server.

Call `ready()` to wait for an open socket.
Check `state` or call `isOpen()` before you depend on the connection.
Each client supports one active response request.
The client does not reconnect or replay a request after a connection failure.

## WebSocket close timeout

Call and await `responses.close()` after you complete work with the client.
The default close timeout is 30 seconds.
Pass `timeout` in `close()` options to change that wait.
The client rejects the close promise if the socket does not close before the timeout.

## Request cancellation

Pass an `AbortSignal` in request options.
An abort ends the active request and does not start it again.
Create a new `AbortController` for each request that requires separate cancellation.

## Logger output

Pass a Winston-compatible logger through the `logger` client option.
Check the logger's level when it does not show records.
Use `debug` to see request starts and `verbose` to see stream event types.
The package does not log request input, response content, or credentials.

## Pricing errors

Use a model ID from the [pricing guide](pricing.md).
Pass non-negative integer token counts.
The cached and cache-write token counts together must not be more than the input token count.
The calculator reports invalid usage with error code `INVALID_USAGE`.

## Report an error

Include the package version, Node.js version, transport, and safe error details in a report.
Remove API keys, credentials, private endpoints, request input, and response content.
See [Support](../README.md#support) to find the project support channels.

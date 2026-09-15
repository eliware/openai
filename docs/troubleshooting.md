# Troubleshooting

Missing API keys fail during client construction. WebSocket transport failures,
abortions, premature closes, and protocol failures are normalized as
`ResponsesError`. Always await `responses.close()` when using WebSockets.

Run the validation commands in the README before reporting a defect and
include the sanitized error metadata, never credentials or full authorization
headers.

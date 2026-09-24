import { ResponsesError } from "../../errors/responses-error.mjs";

export function continueResponse(adapter, input) {
  const state = adapter._activeRequest;
  if (!state || !state.waitingForInput || input?.previous_response_id !== state.waitingForInput) {
    throw new ResponsesError(
      "A matching response.steer.pending event is required before continuing",
    );
  }
  state.continuationSent = true;
  try {
    adapter.socket.send({ type: "response.create", ...input });
  } catch (cause) {
    state.continuationSent = false;
    throw new ResponsesError(cause?.message ?? "Responses WebSocket continuation failed", {
      event: { type: "error" },
      cause,
    });
  }
}

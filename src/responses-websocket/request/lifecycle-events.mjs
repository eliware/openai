import { responsesWebSocketError } from "../../errors/websocket-normalize.mjs";
import { normalizeEvent } from "../../events/normalize.mjs";

export function processLifecycleEvent(event, callbacks) {
  if (event.type === "connecting" || event.type === "open") {
    callbacks.onEvent?.(event, event.raw);
    return {};
  }
  if (event.type === "reconnecting" || event.type === "reconnected")
    return {
      error: responsesWebSocketError(
        normalizeEvent(event, event),
        "Responses WebSocket reconnect interrupted the request",
      ),
    };
  if (event.type === "error")
    return {
      error: responsesWebSocketError(normalizeEvent(event, event), "Responses WebSocket error"),
    };
  if (event.type === "close")
    return {
      error: responsesWebSocketError(
        normalizeEvent(event, event),
        "Responses WebSocket closed before the final response",
      ),
    };
  return {};
}

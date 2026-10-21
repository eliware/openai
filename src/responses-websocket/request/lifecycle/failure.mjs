import { responsesWebSocketError } from "../../../errors/websocket-normalize.mjs";
import { normalizeEvent } from "../../../events/normalize.mjs";

const FAILURE_MESSAGES = {
  reconnecting: "Responses WebSocket reconnect interrupted the request",
  reconnected: "Responses WebSocket reconnect interrupted the request",
  error: "Responses WebSocket error",
  close: "Responses WebSocket closed before the final response",
};

export function processLifecycleFailure(event) {
  const message = FAILURE_MESSAGES[event.type];
  if (!message) return {};
  return { error: responsesWebSocketError(normalizeEvent(event, event), message) };
}

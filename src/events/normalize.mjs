import { normalizeEventError } from "./error/normalizer.mjs";

function isObject(value) {
  return value !== null && typeof value === "object";
}
export function normalizeEvent(message, raw = message) {
  if (!isObject(message)) return message;
  const event = message.type === "message" && isObject(message.message) ? message.message : message;
  const normalizedError = normalizeEventError(event);
  const response = isObject(event.response) ? event.response : undefined;
  return {
    ...event,
    ...normalizedError,
    raw,
    responseId: event.response_id ?? event.responseId ?? response?.id,
    requestId:
      event.request_id ?? event.requestId ?? event._request_id ?? normalizedError.requestId,
  };
}

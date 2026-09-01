function isObject(value) { return value !== null && typeof value === 'object'; }

export function normalizeEvent(message, raw = message) {
  if (!isObject(message)) return message;
  const event = message.type === 'message' && isObject(message.message) ? message.message : message;
  const nestedError = isObject(event.error) ? event.error : undefined;
  const response = isObject(event.response) ? event.response : undefined;
  const item = isObject(event.item) ? event.item : undefined;
  return {
    ...event,
    raw,
    responseId: event.response_id ?? event.responseId ?? response?.id ?? item?.id,
    requestId: event.request_id ?? event.requestId ?? event._request_id
      ?? nestedError?.request_id ?? nestedError?.requestId,
    ...(event.error === undefined ? {} : { error: event.error }),
  };
}

export function eventErrorDetails(event) {
  const error = isObject(event?.error) ? event.error : event;
  return {
    code: error?.code,
    type: error?.type,
    status: error?.status ?? error?.status_code,
    parameter: error?.param ?? error?.parameter,
    requestId: error?.request_id ?? error?.requestId ?? event?.request_id ?? event?.requestId ?? event?._request_id,
  };
}

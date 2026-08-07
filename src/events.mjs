export function normalizeEvent(message, raw = message) {
  if (!message || typeof message !== 'object') return message;
  return { ...message, raw, responseId: message.response_id ?? message.response?.id, requestId: message.request_id };
}

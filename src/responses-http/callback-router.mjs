const CALLBACKS = {
  'response.created': ['onResponseCreated', 'response'],
  'response.in_progress': ['onResponseProgress', 'response'],
  'response.content_part.added': ['onContentPartAdded', 'part'],
  'response.content_part.done': ['onContentPartDone', 'part'],
  'response.output_text.delta': ['onTextDelta', 'delta'],
  'response.output_text.done': ['onTextDone', 'text'],
  'response.output_item.added': ['onItemAdded', 'item'],
  'response.output_item.done': ['onItemDone', 'item'],
};

export function routeCallback(normalized, handlers) {
  const route = CALLBACKS[normalized.type];
  if (route) handlers[route[0]]?.(normalized[route[1]], normalized);
  if (normalized.type === 'response.completed') {
    handlers.onCompleted?.(normalized.response, normalized);
    handlers.onResponseCompleted?.(normalized.response, normalized);
  }
  return normalized;
}

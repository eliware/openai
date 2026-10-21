export function processConnectionLifecycleEvent(event, callbacks) {
  callbacks.onEvent?.(event, event.raw);
  return {};
}

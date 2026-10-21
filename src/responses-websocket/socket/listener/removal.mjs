export function removeAllListeners(listeners, binding, event) {
  if (event === undefined) {
    for (const name of listeners.keys()) removeAllListeners(listeners, binding, name);
    return;
  }
  for (const wrapped of listeners.get(event)?.values() ?? []) binding.remove(event, wrapped);
  listeners.delete(event);
}

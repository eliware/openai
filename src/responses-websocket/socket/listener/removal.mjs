export function removeAllListeners(store, binding, event) {
  if (event === undefined) {
    for (const name of store.events()) removeAllListeners(store, binding, name);
    return;
  }
  for (const wrapped of store.values(event)) binding.remove(event, wrapped);
  store.clear(event);
}

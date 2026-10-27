import { createSocketListenerBinding } from "./binding.mjs";
import { createListenerStore } from "./store.mjs";

export function createListenerRegistry(socket) {
  const store = createListenerStore();
  return createSocketListenerBinding(socket, store);
}

import { createListenerRegistry } from "./registry.mjs";
import { createListenerMethods } from "./methods.mjs";

export function createNodeSocketListenerAdapter(adapter) {
  adapter.listeners = createListenerRegistry(adapter.socket);
  return createListenerMethods(adapter);
}

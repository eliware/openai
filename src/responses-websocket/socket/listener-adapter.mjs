import { createListenerRegistry } from "./listener/registry.mjs";
import { createListenerMethods } from "./listener/methods.mjs";

export function createNodeSocketListenerAdapter(adapter) {
  adapter.listeners = createListenerRegistry(adapter.socket);
  return createListenerMethods(adapter);
}

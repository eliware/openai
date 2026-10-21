import { createListenerOnceMethod } from "./once.mjs";
import { createListenerRegistrationMethods } from "./registration.mjs";

export function createListenerMethods(adapter) {
  return {
    ...createListenerRegistrationMethods(adapter),
    once: createListenerOnceMethod(adapter),
  };
}

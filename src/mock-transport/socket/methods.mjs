import { createMockSocketListenerDelegates } from "./methods/listeners.mjs";
import { createMockSocketOperations } from "./methods/operations.mjs";

export function createMockSocketMethods(defaults) {
  return {
    ...createMockSocketListenerDelegates(),
    ...createMockSocketOperations(defaults),
  };
}

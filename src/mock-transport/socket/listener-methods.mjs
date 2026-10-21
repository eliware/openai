import { createMockSocketOnceMethod } from "./listener-methods/once.mjs";
import { createMockSocketListenerRegistrationMethods } from "./listener-methods/registration.mjs";

export function createMockSocketListenerMethods(socket) {
  const methods = createMockSocketListenerRegistrationMethods(socket);
  return { ...methods, once: createMockSocketOnceMethod(methods) };
}

import { createMockSocketClass } from "./mock-transport/class.mjs";
export function createMockResponsesTransport(events = [], options = {}) {
  return createMockSocketClass(events, options);
}

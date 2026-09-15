import { createMockSocketClass } from './mock-transport/socket.mjs';
export function createMockResponsesTransport(events = [], options = {}) { return createMockSocketClass(events, options); }

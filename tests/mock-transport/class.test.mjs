import { createMockSocketClass } from "../../src/mock-transport/class.mjs";

test("sets WebSocket state constants on the generated class", () => {
  const MockSocket = createMockSocketClass([], { autoOpen: false });

  expect(MockSocket.OPEN).toBe(1);
  expect(MockSocket.CONNECTING).toBe(0);
  expect(MockSocket.CLOSING).toBe(2);
  expect(MockSocket.CLOSED).toBe(3);
});

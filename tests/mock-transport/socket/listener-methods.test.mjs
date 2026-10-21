import { createMockSocketListenerMethods } from "../../../src/mock-transport/socket/listener-methods.mjs";

test("composes listener registration and one-shot methods", () => {
  const socket = { listeners: new Map() };
  const methods = createMockSocketListenerMethods(socket);

  expect(methods.on).toEqual(expect.any(Function));
  expect(methods.once).toEqual(expect.any(Function));
  expect(methods.off).toEqual(expect.any(Function));
});

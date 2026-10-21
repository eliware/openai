import { createMockSocketListenerMethods } from "../../../../src/mock-transport/socket/listener-methods.mjs";

test("removes a once listener before it calls the listener", () => {
  const socket = { listeners: new Map() };
  const methods = createMockSocketListenerMethods(socket);
  const seen = [];

  expect(methods.once("open", (value) => seen.push(value))).toBe(socket);
  methods.emit("open", "ready");
  methods.emit("open", "again");
  expect(seen).toEqual(["ready"]);
});

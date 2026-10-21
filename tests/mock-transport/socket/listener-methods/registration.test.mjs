import { createMockSocketListenerRegistrationMethods } from "../../../../src/mock-transport/socket/listener-methods/registration.mjs";

test("registers, removes, and emits socket listeners", () => {
  const socket = { listeners: new Map() };
  const methods = createMockSocketListenerRegistrationMethods(socket);
  const seen = [];
  const listener = (value) => seen.push(value);

  expect(methods.on("open", listener)).toBe(socket);
  expect(methods.emit("open", "ready")).toBe(socket);
  expect(methods.off("open", listener)).toBe(socket);
  methods.emit("open", "ignored");
  expect(seen).toEqual(["ready"]);
});

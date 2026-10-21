import { createMockSocketListenerMethods } from "../../../src/mock-transport/socket/listener-methods.mjs";

test("adds, removes, emits, and adapts mock listeners", () => {
  const socket = { listeners: new Map() };
  const methods = createMockSocketListenerMethods(socket);
  const seen = [];
  const listener = (value) => seen.push(value);
  expect(methods.on("message", listener)).toBe(socket);
  expect(methods.emit("message", "one")).toBe(socket);
  expect(methods.off("message", listener)).toBe(socket);
  expect(methods.emit("message", "two")).toBe(socket);
  expect(methods.removeListener("missing", listener)).toBe(socket);
  expect(seen).toEqual(["one"]);
});

test("removes a once listener before it calls the listener", () => {
  const socket = { listeners: new Map() };
  const methods = createMockSocketListenerMethods(socket);
  const seen = [];
  expect(methods.once("open", (value) => seen.push(value))).toBe(socket);
  methods.emit("open", "ready");
  methods.emit("open", "again");
  expect(seen).toEqual(["ready"]);
});

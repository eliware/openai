import {
  addListener,
  removeListener,
  emit,
} from "../../../src/mock-transport/socket/listeners.mjs";
import { createMockSocketListenerMethods } from "../../../src/mock-transport/socket/listener-methods.mjs";

test("adds, emits, and removes mock socket listeners", () => {
  const socket = { listeners: new Map() };
  const methods = createMockSocketListenerMethods(socket);
  const seen = [];
  const helperListener = (value) => seen.push(`helper:${value}`);
  const socketListener = (value) => seen.push(`socket:${value}`);
  expect(addListener(socket, "message", helperListener)).toBe(socket);
  expect(methods.on("message", socketListener)).toBe(socket);
  emit(socket, "message", "one");
  expect(methods.off("message", socketListener)).toBe(socket);
  removeListener(socket, "message", helperListener);
  methods.emit("message", "two");
  expect(seen).toEqual(["helper:one", "socket:one"]);
});

import {
  addListener,
  removeListener,
  emit,
} from "../../../src/mock-transport/socket/listeners.mjs";

test("adds, emits, and removes listeners through socket helpers", () => {
  const socket = { listeners: new Map() };
  const seen = [];
  const listener = (value) => seen.push(value);
  expect(addListener(socket, "message", listener)).toBe(socket);
  emit(socket, "message", "one");
  removeListener(socket, "message", listener);
  emit(socket, "message", "two");
  expect(seen).toEqual(["one"]);
});

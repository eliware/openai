import { createListenerMethods } from "../../../../src/responses-websocket/socket/listener/methods.mjs";

test("adapts listener methods through a registry", () => {
  const calls = [];
  const adapter = {
    listeners: {
      add: (...args) => calls.push(["add", ...args]),
      remove: (...args) => calls.push(["remove", ...args]),
      removeAll: (...args) => calls.push(["removeAll", ...args]),
    },
  };
  const methods = createListenerMethods(adapter);
  const listener = () => {};
  expect(methods.on("message", listener)).toBe(adapter);
  expect(methods.off("message", listener)).toBe(adapter);
  expect(methods.removeAllListeners("message")).toBe(adapter);
  expect(methods.addEventListener("open", listener)).toBe(adapter);
  expect(methods.removeEventListener("open", listener)).toBe(adapter);
  expect(calls).toEqual([
    ["add", "message", listener],
    ["remove", "message", listener],
    ["removeAll", "message"],
    ["add", "open", listener],
    ["remove", "open", listener],
  ]);
});

test("composes registration and one-shot listener methods", () => {
  const adapter = { listeners: { add() {}, remove() {}, removeAll() {} } };
  const methods = createListenerMethods(adapter);

  expect(methods.on).toEqual(expect.any(Function));
  expect(methods.once).toEqual(expect.any(Function));
  expect(methods.removeAllListeners).toEqual(expect.any(Function));
});

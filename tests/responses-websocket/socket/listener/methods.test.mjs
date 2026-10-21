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

test("removes a once listener before it calls the listener", () => {
  const calls = [];
  let onCallback;
  const adapter = {
    listeners: {
      add: (_event, callback) => (onCallback = callback),
      remove: (_event, callback) => calls.push(["remove", callback]),
      removeAll() {},
    },
  };
  const methods = createListenerMethods(adapter);
  const listener = (value) => calls.push(["listener", value]);
  expect(methods.once("open", listener)).toBe(adapter);
  onCallback("ready");
  expect(calls[0][0]).toBe("remove");
  expect(calls[1]).toEqual(["listener", "ready"]);
});

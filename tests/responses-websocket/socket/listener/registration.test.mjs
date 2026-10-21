import { createListenerRegistrationMethods } from "../../../../src/responses-websocket/socket/listener/registration.mjs";

test("delegates listener registration and removal to the registry", () => {
  const calls = [];
  const adapter = {
    listeners: {
      add: (...args) => calls.push(["add", ...args]),
      remove: (...args) => calls.push(["remove", ...args]),
      removeAll: (...args) => calls.push(["removeAll", ...args]),
    },
  };
  const methods = createListenerRegistrationMethods(adapter);
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

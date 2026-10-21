import { createMockSocketListenerDelegates } from "../../../../src/mock-transport/socket/methods/listeners.mjs";

test("delegates listener operations to listener methods", () => {
  const calls = [];
  const socket = {
    listenerMethods: Object.fromEntries(
      ["on", "once", "off", "removeListener", "emit"].map((name) => [
        name,
        (...args) => {
          calls.push([name, ...args]);
          return name;
        },
      ]),
    ),
  };
  const methods = createMockSocketListenerDelegates();

  expect(methods.on.call(socket, "open", "listener")).toBe("on");
  expect(methods.once.call(socket, "open", "listener")).toBe("once");
  expect(methods.off.call(socket, "open", "listener")).toBe("off");
  expect(methods.removeListener.call(socket, "open", "listener")).toBe("removeListener");
  expect(methods.emit.call(socket, "open", "value")).toBe("emit");
  expect(calls.map(([name]) => name)).toEqual(["on", "once", "off", "removeListener", "emit"]);
});

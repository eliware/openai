import { createListenerOnceMethod } from "../../../../src/responses-websocket/socket/listener/once.mjs";

test("removes a one-shot listener before calling it", () => {
  const calls = [];
  let onCallback;
  const adapter = {
    listeners: {
      add: (_event, callback) => (onCallback = callback),
      remove: (_event, callback) => calls.push(["remove", callback]),
    },
  };
  const method = createListenerOnceMethod(adapter);
  const listener = (value) => calls.push(["listener", value]);

  expect(method("open", listener)).toBe(adapter);
  onCallback("ready");
  expect(calls[0][0]).toBe("remove");
  expect(calls[1]).toEqual(["listener", "ready"]);
});

import { createNodeSocketListenerAdapter } from "../../../src/responses-websocket/socket/listener-adapter.mjs";

test("adapts Node socket listener methods through the registry", () => {
  const registered = new Map();
  const socket = {
    on: (event, listener) => registered.set(event, listener),
    removeListener: (event, listener) => {
      if (registered.get(event) === listener) registered.delete(event);
    },
  };
  const adapter = { socket };
  Object.assign(adapter, createNodeSocketListenerAdapter(adapter));
  const seen = [];
  const listener = (value) => seen.push(value);
  expect(adapter.on("message", listener)).toBe(adapter);
  registered.get("message")("hello", false);
  expect(seen).toEqual(["hello"]);
  expect(adapter.addEventListener("open", listener)).toBe(adapter);
  expect(adapter.removeEventListener("open", listener)).toBe(adapter);
  expect(adapter.off("message", listener)).toBe(adapter);
  expect(adapter.removeAllListeners()).toBe(adapter);
});

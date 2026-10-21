import { jest } from "@jest/globals";
import { NodeSocketAdapter } from "../../../src/responses-websocket/socket/node-adapter.mjs";

test("wraps a node-style socket", () => {
  const raw = { readyState: 1, on() {}, removeListener() {}, send() {}, close() {} };
  expect(new NodeSocketAdapter(raw).readyState).toBe(1);
});

test("composes socket operations and listener methods", () => {
  const registered = new Map();
  const raw = {
    readyState: 1,
    on: (event, listener) => registered.set(event, listener),
    removeListener: jest.fn((event, listener) => {
      if (registered.get(event) === listener) registered.delete(event);
    }),
    send() {},
    close() {},
  };
  const adapter = new NodeSocketAdapter(raw);
  const seen = [];
  const listener = (value) => seen.push(value);

  expect(adapter.readyState).toBe(1);
  expect(typeof adapter.send).toBe("function");
  expect(adapter.on("message", listener)).toBe(adapter);
  registered.get("message")(Buffer.from("hello"), false);
  expect(seen).toEqual(["hello"]);
  expect(adapter.addEventListener("open", listener)).toBe(adapter);
  expect(adapter.removeEventListener("open", listener)).toBe(adapter);
  expect(adapter.off("message", listener)).toBe(adapter);
  expect(adapter.removeAllListeners()).toBe(adapter);
  expect(raw.removeListener).toHaveBeenCalled();
});

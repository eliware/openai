import { NodeSocketAdapter } from "../../../src/responses-websocket/socket/node-adapter.mjs";

test("wraps a node-style socket", () => {
  const raw = { readyState: 1, on() {}, removeListener() {}, send() {}, close() {} };
  expect(new NodeSocketAdapter(raw).readyState).toBe(1);
});

test("composes socket operation and listener methods", () => {
  const adapter = new NodeSocketAdapter({
    readyState: 1,
    on() {},
    removeListener() {},
    send() {},
    close() {},
  });
  expect(adapter.readyState).toBe(1);
  expect(typeof adapter.send).toBe("function");
  expect(typeof adapter.on).toBe("function");
});

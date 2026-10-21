import { createInjectedSocket } from "../../../src/responses-websocket/socket/injected.mjs";

test("constructs an injected socket with authorization headers", () => {
  const calls = [];
  class Impl {
    constructor(...args) {
      calls.push(args);
      return {
        readyState: 1,
        on() {},
        removeListener() {},
        send() {},
        close() {},
      };
    }
  }

  const injected = createInjectedSocket(Impl, "ws://example", { Authorization: "one" });

  expect(injected.socket.readyState).toBe(1);
  expect(calls).toEqual([["ws://example", { headers: { Authorization: "one" } }]]);
});

test("rejects values that are not constructors", () => {
  expect(() => createInjectedSocket(null, "url", {})).toThrow(
    "WebSocketImpl must be a WebSocket constructor",
  );
});

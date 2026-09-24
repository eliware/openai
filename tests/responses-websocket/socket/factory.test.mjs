import { jest } from "@jest/globals";

const defaultCalls = [];
class DefaultSocket {
  constructor(...args) {
    defaultCalls.push(args);
    return {
      readyState: 1,
      on() {},
      removeListener() {},
      send() {},
      close() {},
    };
  }
}
jest.unstable_mockModule("ws", () => ({ WebSocket: DefaultSocket }));
const { createInjectedSocket, defaultSocket } =
  await import("../../../src/responses-websocket/socket/factory.mjs");

test("constructs injected and default Node sockets with authorization headers", () => {
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

  const defaulted = defaultSocket(undefined, "ws://default", { Authorization: "two" });
  expect(defaulted.socket.readyState).toBe(1);
  expect(defaultCalls).toEqual([["ws://default", { headers: { Authorization: "two" } }]]);
  expect(() => createInjectedSocket(null, "url", {})).toThrow(
    "WebSocketImpl must be a WebSocket constructor",
  );
});

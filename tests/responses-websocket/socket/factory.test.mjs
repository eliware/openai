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
const { createSocket } = await import("../../../src/responses-websocket/socket/factory.mjs");

test("selects the default constructor and passes authorization headers", () => {
  const defaulted = createSocket(undefined, "ws://default", { Authorization: "two" });
  expect(defaulted.socket.readyState).toBe(1);
  expect(defaultCalls).toEqual([["ws://default", { headers: { Authorization: "two" } }]]);
});

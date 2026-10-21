import { jest } from "@jest/globals";

const defaultCalls = [];
jest.unstable_mockModule("ws", () => ({
  WebSocket: class DefaultSocket {
    constructor(...args) {
      defaultCalls.push(args);
      this.readyState = 1;
    }
  },
}));

const { createSocketConnection } =
  await import("../../../src/responses-websocket/socket/connection.mjs");

test("uses the default socket path when no custom configuration exists", () => {
  const fallback = {};
  const createDefault = jest.fn(() => fallback);

  expect(createSocketConnection({}, {}, "ws://default", {}, createDefault)).toBe(fallback);
  expect(createDefault).toHaveBeenCalledTimes(1);
});

test("creates an injected socket with its configured URL and headers", () => {
  const calls = [];
  class CustomSocket {
    constructor(...args) {
      calls.push(args);
      this.readyState = 1;
    }
  }
  const authHeaders = { Authorization: "custom" };
  const connection = createSocketConnection(
    {},
    { url: "ws://custom", implementation: CustomSocket },
    "ws://fallback",
    authHeaders,
    () => {
      throw new Error("The fallback must not run");
    },
  );

  expect(calls).toEqual([["ws://custom", { headers: authHeaders }]]);
  expect(connection.socket).toBeInstanceOf(CustomSocket);
});

test("uses the fallback URL with an injected constructor", () => {
  const calls = [];
  class CustomSocket {
    constructor(...args) {
      calls.push(args);
      this.readyState = 1;
    }
  }
  const authHeaders = { Authorization: "implementation" };

  createSocketConnection({}, { implementation: CustomSocket }, "ws://fallback", authHeaders, () => {
    throw new Error("The fallback must not run");
  });

  expect(calls).toEqual([["ws://fallback", { headers: authHeaders }]]);
});

test("uses the default constructor with a custom URL and auth headers", () => {
  const authHeaders = { Authorization: "url-only" };

  const connection = createSocketConnection(
    {},
    { url: "ws://url-only" },
    "ws://fallback",
    authHeaders,
    () => {
      throw new Error("The fallback must not run");
    },
  );

  expect(defaultCalls).toEqual([["ws://url-only", { headers: authHeaders }]]);
  expect(connection.socket.readyState).toBe(1);
});

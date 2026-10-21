import { jest } from "@jest/globals";

class FakeResponsesWS {
  constructor() {
    this.socket = { readyState: 1 };
  }
  _createSocket() {
    return this.socket;
  }
  send() {}
  close() {}
  async *stream() {}
  on(...args) {
    this.onArgs = args;
    return this;
  }
  off(...args) {
    this.offArgs = args;
    return this;
  }
}

jest.unstable_mockModule("openai/resources/responses/ws", () => ({ ResponsesWS: FakeResponsesWS }));
const defaultCalls = [];
jest.unstable_mockModule("ws", () => ({
  WebSocket: class DefaultSocket {
    constructor(...args) {
      defaultCalls.push(args);
      this.readyState = 1;
      this.on = () => {};
      this.removeListener = () => {};
      this.send = () => {};
      this.close = () => {};
    }
  },
}));
const { ResponsesWebSocketAdapter } = await import("../../src/responses-websocket/index.mjs");
const { InjectableResponsesWS } = await import("../../src/responses-websocket/socket.mjs");

test("composes adapter socket listener methods", () => {
  const adapter = new ResponsesWebSocketAdapter({});
  const listener = () => {};

  expect(adapter.on("open", listener)).toBe(adapter);
  expect(adapter.socket.onArgs).toEqual(["open", listener]);
  expect(adapter.off("open", listener)).toBe(adapter);
  expect(adapter.socket.offArgs).toEqual(["open", listener]);
});

test("selects default and injected sockets with configured URL and auth headers", () => {
  const defaults = new InjectableResponsesWS({}, {});
  expect(defaults._createSocket("ws://default", { Authorization: "default" })).toMatchObject({
    readyState: 1,
  });

  const calls = [];
  class CustomSocket {
    constructor(...args) {
      calls.push(args);
      this.readyState = 1;
      this.on = () => {};
      this.removeListener = () => {};
      this.send = () => {};
      this.close = () => {};
    }
  }
  const injected = new InjectableResponsesWS(
    {},
    { url: "ws://custom", WebSocketImpl: CustomSocket },
  );
  injected._createSocket("ws://fallback", { Authorization: "custom" });
  const implementationOnly = new InjectableResponsesWS({}, { WebSocketImpl: CustomSocket });
  implementationOnly._createSocket("ws://fallback", { Authorization: "implementation" });
  const urlOnly = new InjectableResponsesWS({}, { url: "ws://url-only" });
  urlOnly._createSocket("ws://fallback", { Authorization: "url-only" });
  expect(calls).toEqual([
    ["ws://custom", { headers: { Authorization: "custom" } }],
    ["ws://fallback", { headers: { Authorization: "implementation" } }],
  ]);
  expect(defaultCalls).toEqual([["ws://url-only", { headers: { Authorization: "url-only" } }]]);
});

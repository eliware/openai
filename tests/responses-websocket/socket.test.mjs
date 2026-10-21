import { jest } from "@jest/globals";

class FakeResponsesWS {
  constructor(client) {
    this._client = client;
  }
  _createSocket(url, authHeaders) {
    return { url, authHeaders };
  }
}

jest.unstable_mockModule("openai/resources/responses/ws", () => ({
  ResponsesWS: FakeResponsesWS,
}));
jest.unstable_mockModule("ws", () => ({
  WebSocket: class DefaultSocket {},
}));

const { InjectableResponsesWS } = await import("../../src/responses-websocket/socket.mjs");

test("keeps the SDK socket path when no custom configuration exists", () => {
  const adapter = new InjectableResponsesWS({}, {});
  const authHeaders = { Authorization: "default" };

  expect(adapter._createSocket("ws://default", authHeaders)).toEqual({
    url: "ws://default",
    authHeaders,
  });
});

test("hands WebSocket configuration from the constructor to the subclass", () => {
  class CustomSocket {}
  const client = {};
  const adapter = new InjectableResponsesWS(client, {
    url: "ws://custom",
    WebSocketImpl: CustomSocket,
  });

  expect(adapter._client).toBe(client);
  expect(adapter._customURL).toBe("ws://custom");
  expect(adapter._customWebSocket).toBe(CustomSocket);
});

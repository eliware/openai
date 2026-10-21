import { jest } from "@jest/globals";
import { waitForReadiness } from "../../../src/responses-websocket/lifecycle/readiness.mjs";

class FakeResponsesWS {
  constructor() {
    this.socket = { readyState: 1 };
  }
  _createSocket() {
    return this.socket;
  }
  on() {
    return this;
  }
  off() {
    return this;
  }
  close() {}
  send() {}
  async *stream() {}
}

jest.unstable_mockModule("openai/resources/responses/ws", () => ({ ResponsesWS: FakeResponsesWS }));
jest.unstable_mockModule("ws", () => ({ WebSocket: class {} }));
const { ResponsesWebSocketAdapter } = await import("../../../src/responses-websocket/index.mjs");

test("uses socket events when the socket supports listeners", async () => {
  const handlers = new Map();
  const adapter = {
    socket: {
      socket: {
        on: (name, listener) => handlers.set(name, listener),
        off: (name) => handlers.delete(name),
      },
    },
  };
  const pending = waitForReadiness(adapter);
  handlers.get("open")();
  await expect(pending).resolves.toBeUndefined();
});

test("uses the stream when the socket has no listener API", async () => {
  const adapter = {
    socket: {
      socket: {},
      async *stream() {
        yield { type: "open" };
      },
    },
    isOpen: () => false,
  };
  await expect(waitForReadiness(adapter)).resolves.toBeUndefined();
});

test("composes the public readiness and state methods", async () => {
  const adapter = new ResponsesWebSocketAdapter({});
  expect(adapter.isOpen()).toBe(true);
  expect(adapter.state).toBe("open");
  await expect(adapter.ready()).resolves.toBeUndefined();
});

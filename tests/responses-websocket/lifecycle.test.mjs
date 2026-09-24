import { jest } from "@jest/globals";
import { ready } from "../../src/responses-websocket/lifecycle.mjs";

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
const { ResponsesWebSocketAdapter } = await import("../../src/responses-websocket/index.mjs");

test("composes the public readiness, state, and shutdown methods", async () => {
  const adapter = new ResponsesWebSocketAdapter({});

  expect(adapter.isOpen()).toBe(true);
  expect(adapter.state).toBe("open");
  await expect(adapter.ready()).resolves.toBeUndefined();
  await expect(adapter.close()).resolves.toBeUndefined();
  expect(adapter._closed).toBe(true);
});

test("shares pending readiness and waits for stream readiness without socket listeners", async () => {
  const adapter = {
    socket: {
      socket: {},
      stream: async function* () {
        yield { type: "open" };
      },
    },
    isOpen: () => false,
  };
  const first = ready(adapter);
  const second = ready(adapter);
  expect(second).toBe(first);
  await expect(first).resolves.toBeUndefined();
  expect(adapter._readyPromise).toBeNull();
});

test("waits for socket open when an event-capable socket is connecting", async () => {
  const handlers = new Map();
  const socket = {
    on: (name, listener) => handlers.set(name, listener),
    off: (name) => handlers.delete(name),
  };
  const adapter = { socket: { socket }, isOpen: () => false };
  const pending = ready(adapter);
  handlers.get("open")();
  await expect(pending).resolves.toBeUndefined();
  expect(adapter._readyPromise).toBeNull();
});

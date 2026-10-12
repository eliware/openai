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

test("waits for stream readiness without socket listeners", async () => {
  const adapter = {
    socket: {
      socket: {},
      stream: async function* () {
        yield { type: "open" };
      },
    },
    isOpen: () => false,
  };
  await expect(ready(adapter)).resolves.toBeUndefined();
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
});

test("aborts one concurrent readiness wait without cancelling another", async () => {
  const handlers = new Map();
  const socket = {
    readyState: 0,
    on: (name, listener) => handlers.set(name, [...(handlers.get(name) ?? []), listener]),
    off: (name, listener) =>
      handlers.set(
        name,
        (handlers.get(name) ?? []).filter((item) => item !== listener),
      ),
  };
  const adapter = { socket: { socket }, isOpen: () => false };
  const controller = new AbortController();
  const cancelled = ready(adapter, controller.signal);
  const waiting = ready(adapter);
  controller.abort();
  await expect(cancelled).rejects.toMatchObject({ name: "AbortError" });
  for (const listener of handlers.get("open")) listener();
  await expect(waiting).resolves.toBeUndefined();
});

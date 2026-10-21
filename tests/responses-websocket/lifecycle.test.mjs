import { jest } from "@jest/globals";

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
  async *stream() {
    for (const event of FakeResponsesWS.events ?? [
      { type: "message", message: { type: "response.output_text.delta", delta: "hi" } },
      {
        type: "message",
        message: { type: "response.completed", response: { status: "completed" } },
      },
    ])
      yield event;
    FakeResponsesWS.events = undefined;
  }
}

jest.unstable_mockModule("openai/resources/responses/ws", () => ({ ResponsesWS: FakeResponsesWS }));
jest.unstable_mockModule("ws", () => ({ WebSocket: class {} }));
const { ResponsesWebSocketAdapter } = await import("../../src/responses-websocket/index.mjs");

test("supports abort, lifecycle, and socket errors", async () => {
  const adapter = new ResponsesWebSocketAdapter({}, {}, {});
  const controller = new AbortController();
  controller.abort();
  await expect(adapter.create({}, { signal: controller.signal })).rejects.toMatchObject({
    name: "AbortError",
  });
  expect(adapter.isOpen()).toBe(true);
  expect(adapter.state).toBe("open");
  await adapter.ready();
  FakeResponsesWS.events = [{ type: "error", error: new Error("socket") }];
  await expect(adapter.create({})).rejects.toThrow("socket");
});

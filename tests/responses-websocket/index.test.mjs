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
  on() {
    return this;
  }
  off() {
    return this;
  }
  async *stream() {
    yield* FakeResponsesWS.events ?? [
      { type: "message", message: { type: "response.output_text.delta", delta: "hi" } },
      {
        type: "message",
        message: { type: "response.completed", response: { status: "completed" } },
      },
    ];
    FakeResponsesWS.events = undefined;
  }
}

jest.unstable_mockModule("openai/resources/responses/ws", () => ({ ResponsesWS: FakeResponsesWS }));
jest.unstable_mockModule("ws", () => ({ WebSocket: class {} }));
const { ResponsesWebSocketAdapter } = await import("../../src/responses-websocket/index.mjs");

test("composes the public create and stream response APIs", async () => {
  const adapter = new ResponsesWebSocketAdapter({});
  expect(await adapter.create({ model: "gpt-6-luna" })).toMatchObject({ status: "completed" });
  const events = [];
  for await (const event of adapter.stream({ model: "gpt-6-luna" })) events.push(event);
  expect(events.map(({ type }) => type)).toEqual([
    "response.output_text.delta",
    "response.completed",
  ]);
});

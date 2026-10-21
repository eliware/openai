import { jest } from "@jest/globals";
import { createServer } from "node:http";
class FakeResponsesWS {
  constructor() {
    this.handlers = new Map();
    this.sent = [];
    this.closed = false;
    this.socket = { readyState: 1 };
  }
  send(event) {
    this.sent.push(event);
  }
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
  close(props) {
    this.closed = props ?? true;
  }
  on(event, listener) {
    this.handlers.set(event, listener);
    return this;
  }
  off(event) {
    this.handlers.delete(event);
    return this;
  }
}
jest.unstable_mockModule("openai/resources/responses/ws", () => ({ ResponsesWS: FakeResponsesWS }));
const { createOpenAI } = await import("../src/client.mjs");
afterEach(() => {
  delete process.env.OPENAI_API_KEY;
  FakeResponsesWS.events = undefined;
});

describe("createOpenAI", () => {
  test("validates and accepts options", () => {
    expect(() => createOpenAI()).toThrow("API key");
    expect(createOpenAI("test-key").apiKey).toBe("test-key");
    process.env.OPENAI_API_KEY = "env-key";
    const client = createOpenAI({ baseURL: "https://example.test", timeout: 1234, maxRetries: 2 });
    expect(client.apiKey).toBe("env-key");
    expect(client.baseURL).toBe("https://example.test");
    expect(() => createOpenAI(123)).toThrow("options");
    expect(() => createOpenAI({ apiKey: "  " })).toThrow("API key");
  });
  test("handles transport selection", () => {
    expect(createOpenAI({ apiKey: "key", transport: "http" }).apiKey).toBe("key");
    expect(() => createOpenAI({ apiKey: "key", transport: "ftp" })).toThrow(
      "Unsupported transport",
    );
  });
  test("injects a logger into the HTTP client without logging request data", async () => {
    const logger = { log: jest.fn() };
    const client = createOpenAI({
      apiKey: "secret-key",
      logger,
      fetch: async () =>
        new Response(
          JSON.stringify({ id: "r1", object: "response", status: "completed", output: [] }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        ),
    });
    await client.responses.create({ model: "gpt-6-luna", input: "private input" });
    expect(logger.log).toHaveBeenCalledWith(
      "info",
      "Responses request completed",
      expect.objectContaining({ transport: "http" }),
    );
    expect(JSON.stringify(logger.log.mock.calls)).not.toMatch(
      /secret-key|private input|gpt-6-luna/,
    );
  });
  test("creates websocket client with streaming APIs", async () => {
    const logger = { log: jest.fn() };
    const client = createOpenAI({
      apiKey: "secret-key",
      transport: "websocket",
      maxQueueSize: 2,
      logger,
    });
    const stream = [];
    for await (const event of client.responses.create({ model: "test", stream: true }))
      stream.push(event);
    expect(stream).toHaveLength(2);
    await expect(client.responses.create({ model: "test" })).resolves.toMatchObject({
      status: "completed",
    });
    const listener = () => {};
    client.responses.on("error", listener).off("error", listener);
    await client.responses.close();
    expect(logger.log).toHaveBeenCalledWith(
      "debug",
      "Responses request started",
      expect.objectContaining({ transport: "websocket" }),
    );
    expect(logger.log).toHaveBeenCalledWith(
      "verbose",
      "Responses stream event",
      expect.objectContaining({ eventType: "response.completed" }),
    );
    expect(JSON.stringify(logger.log.mock.calls)).not.toContain("secret-key");
  });
});

test("uses the real SDK HTTP transport with a local server", async () => {
  const server = createServer((_request, response) => {
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ id: "local-http-response", status: "completed" }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const client = createOpenAI({
    apiKey: "integration-key",
    baseURL: `http://127.0.0.1:${port}/v1`,
  });
  try {
    await expect(client.responses.create({ model: "integration-model" })).resolves.toMatchObject({
      id: "local-http-response",
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}, 10_000);

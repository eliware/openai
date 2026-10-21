import { jest } from "@jest/globals";
import { createMockResponsesTransport } from "../../src/mock-transport.mjs";
import { attachTransport } from "../../src/client/transport.mjs";
import { createOpenAI } from "../../src/client.mjs";

test("rejects unsupported transports", () => {
  expect(() => attachTransport({ responses: {} }, { transport: "other" })).toThrow(
    "Unsupported transport",
  );
});

test("attaches the HTTP transport", () => {
  const client = { responses: { create: jest.fn() } };
  expect(attachTransport(client, { transport: "http" })).toBe(client);
  expect(client.responses).not.toBeUndefined();
});

describe("client transport integration", () => {
  test("uses the real SDK WebSocket transport with a local server", async () => {
    const WebSocketImpl = createMockResponsesTransport([
      {
        type: "response.completed",
        response: {
          id: "local-response",
          status: "completed",
        },
      },
    ]);
    const client = createOpenAI({
      apiKey: "integration-key",
      transport: "websocket",
      WebSocketImpl,
      url: "ws://localhost",
    });
    try {
      await expect(client.responses.create({ model: "integration-model" })).resolves.toMatchObject({
        status: "completed",
      });
    } finally {
      await client.responses.close();
    }
  }, 10_000);
});

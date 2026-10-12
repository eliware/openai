import { jest } from "@jest/globals";
import { WebSocketServer } from "ws";
import { createServer } from "node:http";
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
    const server = new WebSocketServer({ port: 0 });
    await new Promise((resolve) => server.once("listening", resolve));
    server.on("connection", (socket) =>
      socket.on("message", () =>
        socket.send(
          JSON.stringify({
            type: "response.completed",
            response: { id: "local-response", status: "completed" },
          }),
        ),
      ),
    );
    const { port } = server.address();
    const client = createOpenAI({
      apiKey: "integration-key",
      transport: "websocket",
      url: `ws://127.0.0.1:${port}`,
    });
    try {
      await expect(client.responses.create({ model: "integration-model" })).resolves.toMatchObject({
        status: "completed",
      });
    } finally {
      await client.responses.close();
      await new Promise((resolve) => server.close(resolve));
    }
  }, 10_000);

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
});

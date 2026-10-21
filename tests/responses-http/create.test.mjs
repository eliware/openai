import { jest } from "@jest/globals";
import { createHTTPCreate } from "../../src/responses-http/create.mjs";

test("creates non-streaming and streaming HTTP responses", async () => {
  const responses = {
    create: jest.fn().mockImplementation((request) =>
      request.stream
        ? (async function* () {
            yield { type: "response.completed", response: { id: "r" } };
          })()
        : Promise.resolve({ output: [] }),
    ),
  };
  const create = createHTTPCreate(responses);
  await expect(create({ model: "gpt-5.6" })).resolves.toEqual({ output: [] });
  await expect(create()).resolves.toEqual({ output: [] });
  await expect(create({ model: "gpt-5.6" }, { timeout: 10 })).resolves.toEqual({ output: [] });
  const events = [];
  for await (const event of create({ model: "gpt-5.6", stream: true })) events.push(event);
  expect(events).toMatchObject([{ type: "response.completed", responseId: "r" }]);
  expect(responses.create).toHaveBeenCalledWith({ model: "gpt-5.6", stream: true }, {});
  expect(responses.create).toHaveBeenCalled();
});

test("logs structured HTTP operations without request or response data", async () => {
  const logger = { log: jest.fn() };
  const responses = {
    create: jest.fn().mockResolvedValue({ id: "secret-response", output: "private output" }),
  };
  const create = createHTTPCreate(responses, logger);
  await create({ input: "private input", apiKey: "private key" });
  expect(logger.log).toHaveBeenCalledWith("debug", "Responses request started", {
    component: "@eliware/openai",
    operation: "responses.create",
    transport: "http",
  });
  expect(logger.log).toHaveBeenCalledWith("http", "Responses request sent", {
    component: "@eliware/openai",
    operation: "responses.create",
    transport: "http",
  });
  expect(logger.log).toHaveBeenCalledWith("info", "Responses request completed", {
    component: "@eliware/openai",
    operation: "responses.create",
    transport: "http",
  });
  expect(JSON.stringify(logger.log.mock.calls)).not.toMatch(/private|secret-response/);
});

test("logs HTTP failures at error and warning levels", async () => {
  const logger = { log: jest.fn() };
  const create = createHTTPCreate(
    { create: jest.fn().mockRejectedValue(new Error("failure")) },
    logger,
  );
  await expect(create()).rejects.toThrow("failure");
  expect(logger.log).toHaveBeenCalledWith(
    "error",
    "Responses request failed",
    expect.objectContaining({ transport: "http" }),
  );

  const aborted = createHTTPCreate(
    { create: jest.fn().mockRejectedValue({ event: { type: "abort" } }) },
    logger,
  );
  await expect(aborted()).rejects.toThrow();
  expect(logger.log).toHaveBeenCalledWith(
    "warn",
    "Responses request failed",
    expect.objectContaining({ transport: "http" }),
  );

  const syncFailure = createHTTPCreate(
    {
      create: () => {
        throw new Error("sync failure");
      },
    },
    logger,
  );
  expect(() => syncFailure()).toThrow("sync failure");
});

test("logs HTTP stream events without response content", async () => {
  const logger = { log: jest.fn() };
  const responses = {
    create: jest.fn().mockImplementation(() =>
      (async function* () {
        yield { type: "response.completed", response: { output_text: "private output" } };
      })(),
    ),
  };
  const events = [];
  for await (const event of createHTTPCreate(responses, logger)({ stream: true }))
    events.push(event);
  expect(logger.log).toHaveBeenCalledWith("verbose", "Responses stream event", {
    component: "@eliware/openai",
    operation: "responses.create",
    transport: "http",
    eventType: "response.completed",
  });
  expect(logger.log).toHaveBeenCalledWith(
    "info",
    "Responses request completed",
    expect.objectContaining({ transport: "http" }),
  );
  expect(JSON.stringify(logger.log.mock.calls)).not.toContain("private output");
  expect(events).toHaveLength(1);
});

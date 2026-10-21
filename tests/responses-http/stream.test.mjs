import { jest } from "@jest/globals";
import { wrapHTTPStream } from "../../src/responses-http/stream.mjs";

test("normalizes and dispatches HTTP stream events", async () => {
  const onEvent = jest.fn();
  const events = [];
  for await (const event of wrapHTTPStream(
    (async function* () {
      yield { type: "response.created", response: { id: "r" } };
    })(),
    { onEvent },
  ))
    events.push(event);
  expect(events[0]).toMatchObject({ type: "response.created", responseId: "r" });
  expect(onEvent).toHaveBeenCalled();
});

test("normalizes a stream error and invokes onError", async () => {
  const error = new Error("stream error");
  const onError = jest.fn();
  const stream = wrapHTTPStream(
    (async function* () {
      yield { type: "response.output_text.delta", delta: "before failure" };
      throw error;
    })(),
    { onError },
  );
  await expect(
    (async () => {
      for await (const event of stream) void event;
    })(),
  ).rejects.toMatchObject({
    name: "ResponsesError",
    cause: error,
  });
  expect(onError).toHaveBeenCalled();
});

test("logs unknown HTTP stream events and aborted requests safely", async () => {
  const logger = { log: jest.fn() };
  const unknownEvents = [];
  for await (const event of wrapHTTPStream(
    (async function* () {
      yield {};
    })(),
    {},
    logger,
  ))
    unknownEvents.push(event);
  expect(unknownEvents).toHaveLength(1);
  expect(logger.log).toHaveBeenCalledWith("verbose", "Responses stream event", {
    component: "@eliware/openai",
    operation: "responses.create",
    transport: "http",
    eventType: "unknown",
  });

  const aborted = wrapHTTPStream(Promise.reject({ event: { type: "abort" } }), {}, logger);
  await expect(
    (async () => {
      for await (const event of aborted) void event;
    })(),
  ).rejects.toThrow();
  expect(logger.log).toHaveBeenCalledWith(
    "warn",
    "Responses request failed",
    expect.objectContaining({ transport: "http" }),
  );
});

test("logs completion when the stream emits a completed event", async () => {
  const logger = { log: jest.fn() };
  for await (const event of wrapHTTPStream(
    (async function* () {
      yield { type: "response.completed" };
    })(),
    {},
    logger,
  ))
    void event;
  expect(logger.log).toHaveBeenCalledWith(
    "info",
    "Responses request completed",
    expect.objectContaining({ transport: "http" }),
  );
});

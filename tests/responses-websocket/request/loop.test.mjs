import { jest } from "@jest/globals";
import { readResponseEvents } from "../../../src/responses-websocket/request/loop.mjs";

async function collect(iterator) {
  const values = [];
  for await (const value of iterator) values.push(value);
  return values;
}

test("yields terminal messages", async () => {
  const next = async () => ({
    value: { type: "message", message: { type: "response.completed", response: { id: "r" } } },
    done: false,
  });
  await expect(collect(readResponseEvents(next, {}, {}, undefined))).resolves.toMatchObject([
    { response: { id: "r" }, responseId: "r", type: "response.completed" },
  ]);
});

test("fails when the stream ends first", async () => {
  let index = 0;
  const values = [{ value: { type: "connecting" }, done: false }, { done: true }];
  await expect(
    collect(readResponseEvents(async () => values[index++], {}, {}, undefined)),
  ).rejects.toThrow("ended before the final response");
});

test("logs message and transport events without event data", async () => {
  const logger = { log: jest.fn() };
  let index = 0;
  const values = [
    { value: { type: "message", message: {} }, done: false },
    { value: { type: 12 }, done: false },
    { value: { type: "open" }, done: false },
    { done: true },
  ];
  await expect(
    collect(
      readResponseEvents(
        async () => values[index++],
        {},
        { wasAborted: () => false },
        undefined,
        undefined,
        logger,
      ),
    ),
  ).rejects.toThrow("ended before the final response");
  expect(logger.log).toHaveBeenCalledWith("verbose", "Responses stream event", {
    component: "@eliware/openai",
    operation: "responses.create",
    transport: "websocket",
    eventType: "unknown",
  });
  expect(logger.log).toHaveBeenCalledWith("silly", "Responses transport event", {
    component: "@eliware/openai",
    operation: "responses.create",
    transport: "websocket",
    eventType: "unknown",
  });
});
test("yields ordinary messages and reports terminal errors", async () => {
  let index = 0;
  const values = [
    {
      value: { type: "message", message: { type: "response.output_text.delta", delta: "x" } },
      done: false,
    },
    {
      value: { type: "message", message: { type: "response.failed", error: { message: "bad" } } },
      done: false,
    },
  ];
  const onError = () => {};
  await expect(
    collect(
      readResponseEvents(
        async () => values[index++],
        { onError },
        { wasAborted: () => false },
        undefined,
      ),
    ),
  ).rejects.toThrow("bad");
});
test("handles terminal errors without an error callback", async () => {
  const next = async () => ({
    value: { type: "message", message: { type: "response.failed", error: { message: "bad" } } },
    done: false,
  });
  await expect(
    collect(readResponseEvents(next, {}, { wasAborted: () => false }, undefined)),
  ).rejects.toThrow("bad");
});

test.each([
  [{ type: "response.failed", error: { message: "provider rejected" } }, "provider rejected"],
])("notifies onError exactly once for %s terminal protocol events", async (message, reason) => {
  const onEvents = [];
  const onErrors = [];
  const next = async () => ({ value: { type: "message", message }, done: false });

  await expect(
    collect(
      readResponseEvents(
        next,
        {
          onEvent: (event) => onEvents.push(event),
          onError: (error, event) => onErrors.push({ error, event }),
        },
        { wasAborted: () => false },
        undefined,
      ),
    ),
  ).rejects.toMatchObject({ name: "ResponsesError", message: reason });

  expect(onEvents).toHaveLength(1);
  expect(onEvents[0].type).toBe(message.type);
  expect(onErrors).toHaveLength(1);
  expect(onErrors[0].error).toMatchObject({ name: "ResponsesError", message: reason });
  expect(onErrors[0].event).toMatchObject({ type: message.type });
});

test("passes normalized provider details to onError for failed responses", async () => {
  const providerError = {
    message: "provider rejected",
    code: "quota",
    status: 429,
    param: "model",
    request_id: "req-1",
  };
  const raw = {
    type: "message",
    message: { type: "response.failed", response_id: "resp-1", error: providerError },
  };
  const onError = jest.fn();

  await expect(
    collect(
      readResponseEvents(
        async () => ({ value: raw, done: false }),
        { onError },
        { wasAborted: () => false },
        undefined,
      ),
    ),
  ).rejects.toMatchObject({
    name: "ResponsesError",
    code: "quota",
    status: 429,
    parameter: "model",
    requestId: "req-1",
  });

  expect(onError).toHaveBeenCalledWith(
    expect.objectContaining({ code: "quota", status: 429, parameter: "model", requestId: "req-1" }),
    expect.objectContaining({ raw, responseId: "resp-1", requestId: "req-1" }),
  );
});

test("yields incomplete responses and stops without reporting an error", async () => {
  let calls = 0;
  const onError = jest.fn();
  const incomplete = {
    type: "response.incomplete",
    response: {
      id: "r1",
      status: "incomplete",
      incomplete_details: { reason: "max_output_tokens" },
    },
  };
  const values = [
    { value: { type: "message", message: incomplete }, done: false },
    {
      value: { type: "message", message: { type: "response.completed", response: { id: "r2" } } },
      done: false,
    },
  ];

  await expect(
    collect(
      readResponseEvents(
        async () => values[calls++],
        { onError },
        { wasAborted: () => false },
        undefined,
      ),
    ),
  ).resolves.toMatchObject([
    { type: "response.incomplete", response: { id: "r1", status: "incomplete" } },
  ]);
  expect(calls).toBe(1);
  expect(onError).not.toHaveBeenCalled();
});
test("keeps the iterator open through steered incomplete and successor completion", async () => {
  let index = 0;
  const values = [
    {
      value: { type: "message", message: { type: "response.created", response: { id: "r1" } } },
      done: false,
    },
    {
      value: {
        type: "message",
        message: { type: "response.steer.accepted", steer: { previous_response_id: "r1" } },
      },
      done: false,
    },
    {
      value: {
        type: "message",
        message: {
          type: "response.incomplete",
          response: { id: "r1", incomplete_details: { reason: "steered" } },
        },
      },
      done: false,
    },
    {
      value: {
        type: "message",
        message: { type: "response.created", response: { id: "r2", previous_response_id: "r1" } },
      },
      done: false,
    },
    {
      value: { type: "message", message: { type: "response.completed", response: { id: "r2" } } },
      done: false,
    },
  ];
  const control = {
    currentResponseId: undefined,
    responseIds: new Set(),
    pendingSteers: new Set(["r1"]),
    acceptedSteers: new Set(),
    waitingForInput: undefined,
    continuationSent: false,
    deferredCompletion: undefined,
  };
  await expect(
    collect(
      readResponseEvents(
        async () => values[index++],
        {},
        { wasAborted: () => false },
        undefined,
        control,
      ),
    ),
  ).resolves.toHaveLength(5);
});
test("waits for steering resolution after a completed response and closes when rejected", async () => {
  let index = 0;
  const values = [
    {
      value: { type: "message", message: { type: "response.created", response: { id: "r1" } } },
      done: false,
    },
    {
      value: { type: "message", message: { type: "response.completed", response: { id: "r1" } } },
      done: false,
    },
    {
      value: {
        type: "message",
        message: {
          type: "response.steer.failed",
          steer: { previous_response_id: "r1" },
          error: { code: "response_already_completed" },
        },
      },
      done: false,
    },
  ];
  const control = {
    currentResponseId: undefined,
    responseIds: new Set(),
    pendingSteers: new Set(["r1"]),
    acceptedSteers: new Set(),
    waitingForInput: undefined,
    continuationSent: false,
    deferredCompletion: undefined,
  };
  await expect(
    collect(
      readResponseEvents(
        async () => values[index++],
        {},
        { wasAborted: () => false },
        undefined,
        control,
      ),
    ),
  ).resolves.toMatchObject([{ type: "response.created" }, { type: "response.completed" }]);
});

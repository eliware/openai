import { processEvent } from "../../../src/responses-websocket/request/terminal.mjs";

test("processes terminal protocol events", () => {
  expect(
    processEvent({ type: "message", message: { type: "response.completed", response: {} } }, {})
      .done,
  ).toBe(true);
  const providerError = {
    message: "bad",
    code: "quota",
    status: 429,
    param: "model",
    request_id: "req-1",
  };
  const failed = processEvent(
    { type: "message", message: { type: "response.failed", error: providerError } },
    {},
  ).error;
  expect(failed).toMatchObject({ message: "bad", cause: providerError });
  expect(
    processEvent(
      { type: "message", message: { type: "response.output_text.delta", delta: "x" } },
      {},
    ),
  ).toMatchObject({ message: { type: "response.output_text.delta" } });
  expect(processEvent({ type: "close" }, {}).error).toBeTruthy();
});

test("normalizes callback events before it updates steering state", () => {
  const control = {
    currentResponseId: undefined,
    responseIds: new Set(),
    pendingSteers: new Set(),
    acceptedSteers: new Set(),
    waitingForInput: undefined,
    continuationSent: false,
    deferredCompletion: undefined,
  };
  const raw = {
    type: "message",
    message: {
      type: "response.steer.pending",
      response_id: "resp_1",
      request_id: "req_1",
      steer: { previous_response_id: "resp_1" },
    },
  };
  let callbackEvent;
  processEvent(raw, { onEvent: (event) => (callbackEvent = event) }, control);
  expect(callbackEvent).toMatchObject({
    type: "response.steer.pending",
    raw,
    responseId: "resp_1",
    requestId: "req_1",
  });
  expect(control.waitingForInput).toBe("resp_1");
});

test("defers completion while steering, accepts steered incomplete, and resolves failed steer", () => {
  const control = {
    currentResponseId: "r",
    responseIds: new Set(["r"]),
    pendingSteers: new Set(["r"]),
    acceptedSteers: new Set(),
    waitingForInput: undefined,
    continuationSent: false,
    deferredCompletion: undefined,
  };
  const completed = {
    type: "message",
    message: { type: "response.completed", response: { id: "r" } },
  };
  expect(processEvent(completed, {}, control)).toMatchObject({
    message: { type: "response.completed" },
  });
  expect(control.deferredCompletion).toMatchObject({ type: "response.completed" });
  expect(
    processEvent(
      {
        type: "message",
        message: {
          type: "response.incomplete",
          response: { id: "r", incomplete_details: { reason: "steered" } },
        },
      },
      {},
      control,
    ),
  ).toMatchObject({ message: { type: "response.incomplete" } });

  control.pendingSteers.clear();
  expect(
    processEvent(
      {
        type: "message",
        message: { type: "response.steer.failed", steer: { previous_response_id: "r" } },
      },
      {},
      control,
    ),
  ).toEqual({ done: true });
});

test("processes incomplete protocol events", () => {
  expect(
    processEvent({ type: "message", message: { type: "response.failed" } }, {}).error,
  ).toBeTruthy();
  expect(
    processEvent({ type: "message", message: { type: "response.incomplete" } }, {}).error,
  ).toBeTruthy();
});

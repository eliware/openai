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
  expect(failed).toMatchObject({
    message: "bad",
    code: "quota",
    status: 429,
    parameter: "model",
    requestId: "req-1",
    cause: providerError,
  });
  expect(
    processEvent(
      { type: "message", message: { type: "response.output_text.delta", delta: "x" } },
      {},
    ),
  ).toMatchObject({ message: { type: "response.output_text.delta" } });
  expect(processEvent({ type: "close" }, {}).error).toBeTruthy();
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

test("processes lifecycle, reconnect, incomplete, and unknown events", () => {
  const seen = [];
  expect(
    processEvent({ type: "connecting" }, { onEvent: (event) => seen.push(event.type) }),
  ).toEqual({});
  expect(processEvent({ type: "reconnecting" }, {}).error).toBeTruthy();
  expect(processEvent({ type: "reconnected" }, {}).error).toBeTruthy();
  expect(processEvent({ type: "open" }, { onEvent: (event) => seen.push(event.type) })).toEqual({});
  expect(processEvent({ type: "error", error: new Error("socket") }, {}).error).toBeTruthy();
  expect(
    processEvent(
      {
        type: "message",
        message: {
          type: "response.incomplete",
          response: { incomplete_details: { reason: "length" } },
        },
      },
      {},
    ).error,
  ).toBeTruthy();
  expect(processEvent({ type: "unknown" }, {})).toEqual({});
  expect(
    processEvent({ type: "message", message: { type: "response.failed" } }, {}).error,
  ).toBeTruthy();
  expect(
    processEvent({ type: "message", message: { type: "response.incomplete" } }, {}).error,
  ).toBeTruthy();
  expect(seen).toEqual(["connecting", "open"]);
});

import { processEvent } from "../../../src/responses-websocket/request/terminal.mjs";
import { createRequestControlState } from "../../../src/responses-websocket/request/control.mjs";

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
  const control = createRequestControlState();
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

test("processes incomplete protocol events", () => {
  expect(
    processEvent({ type: "message", message: { type: "response.failed" } }, {}).error,
  ).toBeTruthy();
  expect(
    processEvent(
      {
        type: "message",
        message: { type: "response.incomplete", response: { status: "incomplete" } },
      },
      {},
    ),
  ).toMatchObject({ done: true, message: { type: "response.incomplete" } });
});

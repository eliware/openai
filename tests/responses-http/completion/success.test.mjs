import { jest } from "@jest/globals";
import { completeHTTPSuccess } from "../../../src/responses-http/completion/success.mjs";

test("dispatches a normalized completion and returns the response", () => {
  const onEvent = jest.fn();
  const response = { id: "resp", request_id: "req" };

  expect(completeHTTPSuccess(response, { onEvent })).toBe(response);
  expect(onEvent).toHaveBeenCalledWith(
    expect.objectContaining({ type: "response.completed", responseId: "resp", requestId: "req" }),
    expect.any(Object),
  );
});

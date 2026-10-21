import { jest } from "@jest/globals";
import { completeHTTPFailure } from "../../../src/responses-http/completion/failure.mjs";

test("normalizes failures, reports the error event, and throws", () => {
  const onError = jest.fn();
  const cause = Object.assign(new Error("bad request"), { status: 429, requestID: "req" });

  expect(() => completeHTTPFailure(cause, { onError })).toThrow(
    expect.objectContaining({ name: "ResponsesError", status: 429, requestId: "req", cause }),
  );
  expect(onError).toHaveBeenCalledWith(
    expect.objectContaining({ name: "ResponsesError" }),
    expect.objectContaining({ type: "error", requestId: "req" }),
  );
});

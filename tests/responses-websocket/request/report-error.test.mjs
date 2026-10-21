import { jest } from "@jest/globals";
import { ResponsesError } from "../../../src/errors/responses-error.mjs";
import { reportRequestError } from "../../../src/responses-websocket/request/report-error.mjs";

test("wraps a request failure and reports its normalized error event", () => {
  const callbacks = { onError: jest.fn() };
  const cause = new Error("socket failed");

  const error = reportRequestError(cause, callbacks);

  expect(error).toMatchObject({
    name: "ResponsesError",
    message: "socket failed",
    cause,
    event: { type: "error" },
  });
  expect(callbacks.onError).toHaveBeenCalledWith(error, expect.objectContaining({ type: "error" }));
});

test("preserves an existing ResponsesError", () => {
  const callbacks = { onError: jest.fn() };
  const error = new ResponsesError("failed", { event: { type: "response.failed" } });

  expect(reportRequestError(error, callbacks)).toBe(error);
  expect(callbacks.onError).toHaveBeenCalledWith(
    error,
    expect.objectContaining({ type: "response.failed" }),
  );
});

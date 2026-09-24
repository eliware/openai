import { jest } from "@jest/globals";
import { normalizeStreamError } from "../../src/responses-http/stream-errors.mjs";

test("normalizes and reports stream errors", () => {
  const handlers = { onError: jest.fn() };
  const result = normalizeStreamError(new Error("failed"), handlers);
  expect(result.message).toBe("failed");
  expect(handlers.onError).toHaveBeenCalled();
});
test("preserves SDK error metadata and supplies raw error event", () => {
  const error = Object.assign(new Error("unavailable"), { status: 503, requestID: "req" });
  const onError = jest.fn();
  expect(normalizeStreamError(error, { onError })).toMatchObject({
    status: 503,
    requestId: "req",
    cause: error,
  });
  expect(onError).toHaveBeenCalledWith(
    expect.any(Error),
    expect.objectContaining({ type: "error", requestId: "req", raw: expect.any(Object) }),
  );
});

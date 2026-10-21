import { normalizeEventError } from "../../../src/events/error/normalizer.mjs";

test("preserves error data and extracts its request ID", () => {
  const error = { code: "invalid", request_id: "request-1" };

  expect(normalizeEventError({ error })).toEqual({ error, requestId: "request-1" });
});

test("supports camel-case request IDs and missing error data", () => {
  expect(normalizeEventError({ error: { requestId: "request-2" } })).toEqual({
    error: { requestId: "request-2" },
    requestId: "request-2",
  });
  expect(normalizeEventError({})).toEqual({ requestId: undefined });
});

import { normalizeCallbackEvent } from "../../src/responses-http/event-normalizer.mjs";
test("normalizes callback events", () => {
  const raw = { type: "response.created", response: { id: "r" } };
  expect(normalizeCallbackEvent(raw).type).toBe("response.created");
});
test("preserves response, request, and raw event metadata", () => {
  const raw = {
    type: "response.output_text.delta",
    delta: "x",
    response_id: "resp",
    request_id: "req",
    server_error: { code: "x" },
  };
  expect(normalizeCallbackEvent(raw)).toMatchObject({
    type: raw.type,
    responseId: "resp",
    requestId: "req",
    server_error: raw.server_error,
    raw,
  });
});

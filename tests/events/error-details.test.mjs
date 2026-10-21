import { eventErrorDetails } from "../../src/events/error-details.mjs";
test("extracts error metadata", () => {
  expect(eventErrorDetails({ error: { code: "x", request_id: "q" } })).toEqual({
    code: "x",
    type: undefined,
    status: undefined,
    parameter: undefined,
    requestId: "q",
  });
});

test("extracts details from a direct error event", () => {
  expect(eventErrorDetails({ type: "error", code: "x" })).toMatchObject({ code: "x" });
});

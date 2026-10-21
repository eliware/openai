import { processLifecycleFailure } from "../../../../src/responses-websocket/request/lifecycle/failure.mjs";

test.each([
  ["reconnecting", "Responses WebSocket reconnect interrupted the request"],
  ["reconnected", "Responses WebSocket reconnect interrupted the request"],
  ["error", "Responses WebSocket error"],
  ["close", "Responses WebSocket closed before the final response"],
])("converts %s events to request failures", (type, message) => {
  expect(processLifecycleFailure({ type })).toMatchObject({
    error: { name: "ResponsesError", message, event: { type } },
  });
});

test("ignores events that do not fail the request", () => {
  expect(processLifecycleFailure({ type: "unknown" })).toEqual({});
});

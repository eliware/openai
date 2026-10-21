import { processLifecycleEvent } from "../../../src/responses-websocket/request/lifecycle-events.mjs";

test("reports connection lifecycle events to the callback", () => {
  const seen = [];
  const callbacks = { onEvent: (...args) => seen.push(args) };
  const raw = { type: "raw" };
  expect(processLifecycleEvent({ type: "connecting", raw }, callbacks)).toEqual({});
  expect(processLifecycleEvent({ type: "open", raw }, callbacks)).toEqual({});
  expect(seen).toEqual([
    [{ type: "connecting", raw }, raw],
    [{ type: "open", raw }, raw],
  ]);
  expect(processLifecycleEvent({ type: "open" }, {})).toEqual({});
});

test.each(["reconnecting", "reconnected"])("normalizes %s failures", (type) => {
  expect(processLifecycleEvent({ type }, {}).error).toMatchObject({
    message: "Responses WebSocket reconnect interrupted the request",
    event: { type },
  });
});

test("normalizes socket errors and early closure", () => {
  expect(
    processLifecycleEvent({ type: "error", error: new Error("socket") }, {}).error,
  ).toMatchObject({
    event: { type: "error" },
  });
  expect(processLifecycleEvent({ type: "close", code: 1000 }, {}).error).toMatchObject({
    message: "Responses WebSocket closed before the final response",
    event: { type: "close" },
  });
  expect(processLifecycleEvent({ type: "unknown" }, {})).toEqual({});
});

import { processConnectionLifecycleEvent } from "../../../../src/responses-websocket/request/lifecycle/connection.mjs";

test("dispatches the connection event and raw event to the callback", () => {
  const seen = [];
  const event = { type: "open", raw: { type: "raw" } };

  expect(processConnectionLifecycleEvent(event, { onEvent: (...args) => seen.push(args) })).toEqual(
    {},
  );
  expect(seen).toEqual([[event, event.raw]]);
});

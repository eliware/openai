import { createCloseTimeoutError } from "../../../src/responses-websocket/shutdown/timeout-error.mjs";

test("creates a close timeout error with a close event", () => {
  expect(createCloseTimeoutError()).toMatchObject({
    name: "ResponsesError",
    message: "Responses WebSocket close timed out",
    event: { type: "close", code: "timeout" },
  });
});

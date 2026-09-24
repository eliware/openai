import { getResponsesWebSocketResource } from "../../src/transports/responses-websocket.mjs";

test("WebSocket transport module exports its implementation", () => {
  expect(getResponsesWebSocketResource()).toBeInstanceOf(Function);
});

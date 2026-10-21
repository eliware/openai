import { jest } from "@jest/globals";

class DefaultSocket {}
jest.unstable_mockModule("ws", () => ({ WebSocket: DefaultSocket }));
const { getDefaultSocketConstructor } =
  await import("../../../src/responses-websocket/socket/default.mjs");

test("returns the Node WebSocket constructor", () => {
  expect(getDefaultSocketConstructor()).toBe(DefaultSocket);
});

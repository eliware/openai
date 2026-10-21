import { shouldCompleteSocketClose } from "../../../../src/responses-websocket/shutdown/close/should-complete.mjs";

test.each([
  ["a missing socket", undefined],
  ["a closed socket", { readyState: 3, once() {}, addEventListener() {} }],
  ["a closed wrapped socket", { socket: { closed: true }, once() {}, addEventListener() {} }],
  ["a socket without event APIs", { readyState: 1 }],
])("completes immediately for %s", (_description, socket) => {
  expect(shouldCompleteSocketClose(socket)).toBe(true);
});

test("waits for a socket with event APIs", () => {
  expect(shouldCompleteSocketClose({ once() {} })).toBe(false);
  expect(shouldCompleteSocketClose({ addEventListener() {} })).toBe(false);
});

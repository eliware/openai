import { initializeState, isOpen } from "../../../src/responses-websocket/api/state.mjs";

test("initializes adapter state", () => {
  const adapter = { socket: { socket: { readyState: 1 } } };
  initializeState(adapter, { inputItems: {}, inputTokens: {} });
  expect(isOpen(adapter)).toBe(true);
  expect(adapter.inputItems).toEqual({});
  expect(adapter.inputTokens).toEqual({});
  expect(adapter._activeStreams).toBeInstanceOf(Set);
  expect(adapter._closePromise).toBeNull();
});

test("checks whether the socket is open", () => {
  const adapter = { socket: { socket: { readyState: 1 } } };
  expect(isOpen(adapter)).toBe(true);
  adapter.socket.socket.readyState = 0;
  expect(isOpen(adapter)).toBe(false);
});

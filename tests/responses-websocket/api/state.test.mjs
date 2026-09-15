import { expect, test } from '@jest/globals';
import { initializeState, isOpen, state } from '../../../src/responses-websocket/api/state.mjs';

test('initializes and reports adapter state', () => {
  const adapter = { socket: { socket: { readyState: 1 } } };
  initializeState(adapter, { inputItems: {}, inputTokens: {} });
  expect(isOpen(adapter)).toBe(true); expect(state(adapter)).toBe('open');
  adapter._closePromise = Promise.resolve(); expect(state(adapter)).toBe('closing');
});

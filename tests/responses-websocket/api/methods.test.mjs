import { expect, jest, test } from '@jest/globals';
import { attachMethods } from '../../../src/responses-websocket/api/methods.mjs';

test('attaches the public API methods', () => {
  const socket = { on: jest.fn(), off: jest.fn() };
  const adapter = { socket, _responses: { retrieve: jest.fn() } };
  attachMethods(adapter);
  expect(adapter).toHaveProperty('create');
  expect(adapter).toHaveProperty('stream');
  expect(adapter.on('x', () => {})).toBe(adapter);
  expect(adapter.off('x', () => {})).toBe(adapter);
  expect(socket.on).toHaveBeenCalled();
});

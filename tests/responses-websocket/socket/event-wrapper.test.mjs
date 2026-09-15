import { expect, test } from '@jest/globals';
import { wrapSocketListener } from '../../../src/responses-websocket/socket/event-wrapper.mjs';

test('normalizes message and close payloads', () => {
  const values = []; wrapSocketListener('message', (...args) => values.push(args))(Buffer.from('x'), true); wrapSocketListener('close', (...args) => values.push(args))(1000, Buffer.from('bye'));
  expect(values).toEqual([['x', true], [1000, 'bye']]);
});

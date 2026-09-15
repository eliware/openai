import { expect, test } from '@jest/globals';
import { responsesWebSocketError } from '../../src/errors/websocket-normalize.mjs';

test('normalizes WebSocket errors', () => {
  expect(responsesWebSocketError({ error: { message: 'bad' } }, 'fallback').message).toBe('bad');
});
test('normalizes typed and primitive WebSocket events', () => {
  expect(responsesWebSocketError({ type: 'error', error: { message: 'typed' } }, 'fallback').message).toBe('typed');
  expect(responsesWebSocketError('bad', 'fallback').message).toBe('fallback');
});

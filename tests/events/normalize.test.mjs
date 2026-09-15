import { expect, test } from '@jest/globals';
import { normalizeEvent } from '../../src/events/normalize.mjs';
test('normalizes event metadata', () => { expect(normalizeEvent({ type: 'response.completed', response: { id: 'r' }, request_id: 'q' })).toMatchObject({ responseId: 'r', requestId: 'q' }); });
test('handles primitive, wrapped, and nested metadata', () => {
  expect(normalizeEvent('raw')).toBe('raw');
  expect(normalizeEvent({ type: 'message', message: { type: 'x', responseId: 'r', error: { requestId: 'q' } } })).toMatchObject({ responseId: 'r', requestId: 'q', error: { requestId: 'q' } });
  expect(normalizeEvent({ type: 'x', _request_id: 'z' }, { raw: true })).toMatchObject({ raw: { raw: true }, requestId: 'z' });
});

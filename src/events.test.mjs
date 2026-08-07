import { expect, test, describe } from '@jest/globals';
import { normalizeEvent } from './events.mjs';

describe('normalizeEvent', () => {
  test('normalizes direct response and request IDs while retaining raw event', () => {
    const source = { type: 'response.completed', response_id: 'r', request_id: 'q' };
    expect(normalizeEvent(source)).toMatchObject({ responseId: 'r', requestId: 'q', raw: source });
  });
  test('falls back to nested response ID and accepts missing request ID', () => {
    expect(normalizeEvent({ response: { id: 'nested' } })).toMatchObject({ responseId: 'nested', requestId: undefined });
  });
  test('returns non-object values unchanged', () => {
    expect(normalizeEvent(null)).toBeNull();
    expect(normalizeEvent('event')).toBe('event');
  });
});

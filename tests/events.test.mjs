import { expect, test, describe } from '@jest/globals';
import { normalizeEvent } from '../src/events.mjs';

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

test('normalizes HTTP and transport envelopes to the same shape', async () => {
  const response = { id: 'resp_shared' };
  const protocol = { type: 'response.completed', response, request_id: 'req_shared' };
  expect(normalizeEvent(protocol)).toMatchObject({ type: protocol.type, responseId: 'resp_shared', requestId: 'req_shared', raw: protocol });
  expect(normalizeEvent({ type: 'message', message: protocol }, { type: 'message', message: protocol })).toMatchObject({
    type: protocol.type, responseId: 'resp_shared', requestId: 'req_shared', raw: { type: 'message', message: protocol },
  });
});

test('does not mislabel output item ID as response ID', () => {
  expect(normalizeEvent({ item: { id: 'item_1' } })).toMatchObject({ responseId: undefined });
});

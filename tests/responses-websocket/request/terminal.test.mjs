import { expect, test } from '@jest/globals';
import { processEvent } from '../../../src/responses-websocket/request/terminal.mjs';

test('processes terminal protocol events', () => {
  expect(processEvent({ type: 'message', message: { type: 'response.completed', response: {} } }, {}).done).toBe(true);
  expect(processEvent({ type: 'message', message: { type: 'response.failed', error: { message: 'bad' } } }, {}).error).toBeTruthy();
  expect(processEvent({ type: 'close' }, {}).error).toBeTruthy();
});

test('processes lifecycle, reconnect, incomplete, and unknown events', () => {
  const seen = []; expect(processEvent({ type: 'connecting' }, { onEvent: event => seen.push(event.type) })).toEqual({});
  expect(processEvent({ type: 'reconnecting' }, {}).error).toBeTruthy();
  expect(processEvent({ type: 'error', error: new Error('socket') }, {}).error).toBeTruthy();
  expect(processEvent({ type: 'message', message: { type: 'response.incomplete', incomplete_details: { reason: 'length' } } }, {}).error).toBeTruthy();
  expect(processEvent({ type: 'unknown' }, {})).toEqual({}); expect(seen).toEqual(['connecting']);
});

import { expect, jest, test } from '@jest/globals';
import { sendRequest } from '../../../src/responses-websocket/request/send.mjs';

test('sends a response-create request', () => {
  const sent = []; sendRequest({ socket: { send: value => sent.push(value) } }, { model: 'gpt-5.6' }, {}); expect(sent).toEqual([{ type: 'response.create', model: 'gpt-5.6' }]);
});

test('normalizes send failures', () => {
  expect(() => sendRequest({ socket: { send: () => { throw new Error('failed'); } } }, {}, {})).toThrow('failed');
});
test('reports send failures through callbacks', () => {
  const onError = jest.fn(); expect(() => sendRequest({ socket: { send: () => { throw {}; } } }, {}, { onError })).toThrow('Responses WebSocket send failed'); expect(onError).toHaveBeenCalled();
});

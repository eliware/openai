import { expect, jest, test } from '@jest/globals';
import { steerResponse } from '../../../src/responses-websocket/request/steer.mjs';
test('sends steer input for the active response', () => { const send = jest.fn(); const adapter = { _activeRequest: { currentResponseId: 'r', responseIds: new Set(['r']), pendingSteers: new Set() }, socket: { send } }; steerResponse(adapter, 'r', 'change direction'); expect(send).toHaveBeenCalledWith({ type: 'response.steer', previous_response_id: 'r', input: 'change direction' }); expect(adapter._activeRequest.pendingSteers.has('r')).toBe(true); });
test('rejects stale response IDs and invalid input shapes', () => { const adapter = { _activeRequest: { currentResponseId: 'r', responseIds: new Set(['r']), pendingSteers: new Set() }, socket: { send() {} } }; expect(() => steerResponse(adapter, 'old', 'update')).toThrow('current response'); expect(() => steerResponse(adapter, 'r', [])).toThrow('non-empty'); expect(() => steerResponse(adapter, 'r', 1)).toThrow('non-empty'); });
test('normalizes a socket send failure', () => { const adapter = { _activeRequest: { currentResponseId: 'r', responseIds: new Set(['r']), pendingSteers: new Set() }, socket: { send() { throw new Error('offline'); } } }; expect(() => steerResponse(adapter, 'r', 'update')).toThrow('offline'); expect(adapter._activeRequest.pendingSteers.size).toBe(0); });
test('uses a stable error message when the socket throws a non-error value', () => {
  const adapter = { _activeRequest: { currentResponseId: 'r', responseIds: new Set(['r']), pendingSteers: new Set() }, socket: { send() { throw undefined; } } };
  expect(() => steerResponse(adapter, 'r', 'update')).toThrow('Responses WebSocket steering failed');
  expect(adapter._activeRequest.pendingSteers.size).toBe(0);
});

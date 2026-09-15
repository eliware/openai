import { expect, test, jest } from '@jest/globals';
import { readRequestEvent } from '../../../src/responses-websocket/request/read.mjs';

test('reads transport events and normalizes failures', async () => {
  await expect(readRequestEvent(async () => ({ value: 1, done: false }), {}, () => false)).resolves.toEqual({ value: 1, done: false });
  const onError = jest.fn(); await expect(readRequestEvent(async () => { throw new Error('transport'); }, { onError }, () => false)).rejects.toThrow('transport'); expect(onError).toHaveBeenCalled();
});
test('reports aborts and preserves ResponsesError failures', async () => {
  const onError = jest.fn(); const abort = new Error('aborted');
  await expect(readRequestEvent(async () => { throw abort; }, { onError }, () => true)).rejects.toBe(abort);
  const responseError = new (await import('../../../src/errors/responses-error.mjs')).ResponsesError('known');
  await expect(readRequestEvent(async () => { throw responseError; }, { onError }, () => false, { aborted: false })).rejects.toBe(responseError);
});
test('uses the default transport error message', async () => { await expect(readRequestEvent(async () => { throw {}; }, {}, () => false)).rejects.toThrow('Responses WebSocket request failed'); });
test('handles a null transport failure', async () => { await expect(readRequestEvent(async () => { throw null; }, {}, () => false)).rejects.toThrow('Responses WebSocket request failed'); });
test('handles an explicit non-aborted signal', async () => { await expect(readRequestEvent(async () => { throw new Error('transport'); }, {}, () => false, { aborted: false })).rejects.toThrow('transport'); });

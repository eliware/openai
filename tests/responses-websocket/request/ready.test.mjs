import { expect, jest, test } from '@jest/globals';
import { ResponsesError } from '../../../src/errors/responses-error.mjs';
import { ensureReady } from '../../../src/responses-websocket/request/ready.mjs';

test('waits for the adapter', async () => {
    const adapter = { ready: jest.fn().mockResolvedValue(undefined) };
    await ensureReady(adapter, undefined, {});
    expect(adapter.ready).toHaveBeenCalled();
});

test('normalizes non ResponsesError failures', async () => {
    const callbacks = { onError: jest.fn() };
    await expect(ensureReady({ ready: jest.fn().mockRejectedValue(new Error('no')) }, undefined, callbacks)).rejects.toBeInstanceOf(ResponsesError);
    expect(callbacks.onError).toHaveBeenCalled();
});
test('preserves ResponsesError failures', async () => {
    const error = new ResponsesError('known'); const onError = jest.fn();
    await expect(ensureReady({ ready: jest.fn().mockRejectedValue(error) }, undefined, { onError })).rejects.toBe(error);
    expect(onError).toHaveBeenCalled();
});
test('uses the default readiness failure message', async () => { await expect(ensureReady({ ready: jest.fn().mockRejectedValue({}) }, undefined, {})).rejects.toThrow('Responses WebSocket request failed'); });

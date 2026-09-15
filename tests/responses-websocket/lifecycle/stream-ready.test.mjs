import { expect, test } from '@jest/globals';
import { waitForStream } from '../../../src/responses-websocket/lifecycle/stream-ready.mjs';

test('waits for stream readiness', async () => {
  const adapter = { isOpen: () => false, socket: { async *stream() { yield { type: 'open' }; } } };
  await expect(waitForStream(adapter)).resolves.toBeUndefined();
});

test('accepts an already-open adapter and rejects stream failures', async () => {
  await expect(waitForStream({ isOpen: () => true, socket: { async *stream() { yield { type: 'event' }; } } })).resolves.toBeUndefined();
  await expect(waitForStream({ isOpen: () => false, socket: { async *stream() { yield { type: 'close' }; } } })).rejects.toThrow('closed before becoming ready');
  await expect(waitForStream({ isOpen: () => false, socket: { async *stream() { } } })).rejects.toThrow('ended before becoming ready');
});

test('returns the readiness iterator after failure', async () => {
  let returned = false;
  const adapter = { isOpen: () => false, socket: { stream: () => ({ async next() { return { value: { type: 'error', error: new Error('bad') }, done: false }; }, async return() { returned = true; }, [Symbol.asyncIterator]() { return this; } }) } };
  await expect(waitForStream(adapter)).rejects.toThrow('bad'); expect(returned).toBe(true);
});

import { expect, test } from '@jest/globals';
import { createAbortController } from '../../../src/responses-websocket/request/abort.mjs';

test('cancels an active stream when aborted', async () => {
  const controller = new AbortController(); let returned = false; const sent = [];
  const events = { next: () => new Promise(() => {}), return: async () => { returned = true; } };
  const abort = createAbortController({ isOpen: () => true, socket: { send: event => sent.push(event) } }, events, controller.signal);
  controller.signal.addEventListener('abort', abort.onAbort);
  const pending = abort.next(); controller.abort(); await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  expect(sent).toEqual([{ type: 'response.cancel' }]); expect(returned).toBe(true); expect(abort.wasAborted()).toBe(true);
});
test('supports no signal, pre-aborted signals, and closed sockets', async () => {
  const events = { next: async () => ({ done: true }), return: async () => {} };
  const noSignal = createAbortController({ isOpen: () => false, socket: { send() {} } }, events);
  await expect(noSignal.next()).resolves.toEqual({ done: true });
  const controller = new AbortController(); controller.abort(); const pre = createAbortController({ isOpen: () => false, socket: { send() {} } }, events, controller.signal);
  await expect(pre.next()).rejects.toMatchObject({ name: 'AbortError' }); pre.onAbort();
});

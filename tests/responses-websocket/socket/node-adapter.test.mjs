import { expect, test } from '@jest/globals';
import { NodeSocketAdapter } from '../../../src/responses-websocket/socket/node-adapter.mjs';

test('wraps a node-style socket', () => {
  const raw = { readyState: 1, on() {}, removeListener() {}, send() {}, close() {} };
  expect(new NodeSocketAdapter(raw).readyState).toBe(1);
});

test('tracks listeners and supports socket lifecycle methods', () => {
  const listeners = new Map();
  const raw = { readyState: 1, on: (name, fn) => listeners.set(name, fn), removeListener: (name, fn) => { if (listeners.get(name) === fn) listeners.delete(name); }, send() {}, close() {}, terminate: () => 'terminated' };
  const adapter = new NodeSocketAdapter(raw); const seen = []; const listener = value => seen.push(value);
  adapter.on('message', listener); listeners.get('message')('hello', false); expect(seen).toEqual(['hello']);
  adapter.once('open', listener); listeners.get('open')('opened'); expect(seen).toContain('opened');
  adapter.on('close', listener); listeners.get('close')(1000, Buffer.from('done')); expect(seen.at(-1)).toBe(1000);
  expect(adapter.off('message', listener)).toBe(adapter); expect(adapter.removeAllListeners()).toBe(adapter); expect(adapter.terminate()).toBe('terminated');
});

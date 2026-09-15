import { expect, test } from '@jest/globals';
import { createInjectedSocket } from '../../../src/responses-websocket/socket/factory.mjs';

test('creates an injected socket adapter', () => {
  const raw = { readyState: 1, on() {}, removeListener() {}, send() {}, close() {} };
  class Impl { constructor() { return raw; } }
  expect(createInjectedSocket(Impl, 'ws://example', {}).socket).toBe(raw);
});

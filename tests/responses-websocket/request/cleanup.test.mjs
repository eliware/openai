import { expect, test } from '@jest/globals';
import { cleanupRequest } from '../../../src/responses-websocket/request/cleanup.mjs';

test('releases request stream state', () => {
  const stream = { return: () => Promise.resolve() }; const active = new Set([stream]); const adapter = { _activeStreams: active, _requestActive: true };
  cleanupRequest(adapter, stream); expect(active.size).toBe(0); expect(adapter._requestActive).toBe(false);
});

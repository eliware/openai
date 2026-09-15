import { expect, test } from '@jest/globals';
import { openRequest } from '../../../src/responses-websocket/request/session.mjs';
test('opens and registers a request session', () => { const stream = { next: async () => ({ done: true }), return: async () => {} }; const adapter = { _requestActive: false, _activeStreams: new Set(), socket: { stream: () => stream } }; const session = openRequest(adapter, {}, {}); expect(session.events).toBe(stream); expect(adapter._activeStreams.has(stream)).toBe(true); expect(adapter._requestActive).toBe(true); });

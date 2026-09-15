import { jest, expect, test, describe } from '@jest/globals';
import { close } from '../../src/responses-websocket/shutdown.mjs';
class FakeResponsesWS { _createSocket() { return { readyState: 1 }; } constructor() { this.handlers = new Map(); this.sent = []; this.socket = { readyState: 1 }; } send(event) { this.sent.push(event); } async *stream() { for (const event of FakeResponsesWS.events ?? [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'hi' } }, { type: 'message', message: { type: 'response.completed', response: { status: 'completed' } } }]) yield event; FakeResponsesWS.events = undefined; } close(props) { this.closed = props ?? true; } on(event, listener) { this.handlers.set(event, listener); return this; } off(event) { this.handlers.delete(event); return this; } }
jest.unstable_mockModule('openai/resources/responses/ws', () => ({ ResponsesWS: FakeResponsesWS }));
jest.unstable_mockModule('ws', () => ({ WebSocket: class DefaultSocket { constructor() { this.readyState = 1; } on() {} removeListener() {} send() {} close() {} } }));
const { ResponsesWebSocketAdapter } = await import('../../src/responses-websocket/index.mjs');
const make = (http = {}) => new ResponsesWebSocketAdapter({}, {}, http);

describe('ResponsesWebSocketAdapter', () => {
    test('supports abort, lifecycle, and socket errors', async () => { const adapter = make(); const controller = new AbortController(); controller.abort(); await expect(adapter.create({}, { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' }); expect(adapter.isOpen()).toBe(true); expect(adapter.state).toBe('open'); await adapter.ready(); FakeResponsesWS.events = [{ type: 'error', error: new Error('socket') }]; await expect(adapter.create({})).rejects.toThrow('socket'); });
  test('uses the default WebSocket implementation when only url is supplied', async () => {
    const adapter = new ResponsesWebSocketAdapter({}, { url: 'ws://custom' }, {});
    expect(adapter.socket._createSocket('ws://default', {}).readyState).toBe(1);
    await adapter.close();
  });
});

test('is idempotent and supports adapters without a socket close method', async () => {
  const adapter = { _closed: false, _closePromise: null, _activeStreams: new Set(), socket: { socket: { readyState: 1 } } };
  const first = close(adapter); await expect(first).resolves.toBeUndefined(); expect(adapter._closed).toBe(true); await expect(close(adapter)).resolves.toBeUndefined();
});

test('clears a rejected close promise for retry', async () => {
  const socket = { readyState: 1, once: (name, fn) => { if (name === 'error') setImmediate(() => fn(new Error('broken'))); }, off() {} };
  const adapter = { _closed: false, _closePromise: null, _activeStreams: new Set(), socket: { socket, close() {} } };
  await expect(close(adapter)).rejects.toThrow('broken'); expect(adapter._closePromise).toBeNull();
});
test('reuses a close already in progress', () => { const pending = Promise.resolve(); const adapter = { _closed: false, _closePromise: pending }; expect(close(adapter)).toBe(pending); });
test('accepts null close options', async () => { const adapter = { _closed: false, _activeStreams: new Set(), socket: { socket: undefined } }; await expect(close(adapter, null)).resolves.toBeUndefined(); });

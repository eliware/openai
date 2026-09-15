import { jest, expect, test, describe } from '@jest/globals';
class FakeResponsesWS { _createSocket() { return { readyState: 1 }; } constructor() { this.handlers = new Map(); this.sent = []; this.socket = { readyState: 1 }; } send(event) { this.sent.push(event); } async *stream() { for (const event of FakeResponsesWS.events ?? [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'hi' } }, { type: 'message', message: { type: 'response.completed', response: { status: 'completed' } } }]) yield event; FakeResponsesWS.events = undefined; } close(props) { this.closed = props ?? true; } on(event, listener) { this.handlers.set(event, listener); return this; } off(event) { this.handlers.delete(event); return this; } }
jest.unstable_mockModule('openai/resources/responses/ws', () => ({ ResponsesWS: FakeResponsesWS }));
jest.unstable_mockModule('ws', () => ({ WebSocket: class DefaultSocket { constructor() { this.readyState = 1; } on() {} removeListener() {} send() {} close() {} } }));
const { ResponsesWebSocketAdapter } = await import('../../src/responses-websocket/index.mjs');
const make = (http = {}) => new ResponsesWebSocketAdapter({}, {}, http);

describe('ResponsesWebSocketAdapter', () => {
    test('delegates HTTP helpers', async () => { const calls = {}; const http = {}; for (const name of ['retrieve', 'delete', 'cancel', 'parse']) http[name] = (...args) => { calls[name] = args; return Promise.resolve(name); }; const adapter = make(http); await expect(adapter.retrieve('id')).resolves.toBe('retrieve'); await expect(adapter.delete('id')).resolves.toBe('delete'); await expect(adapter.cancel('id')).resolves.toBe('cancel'); await expect(adapter.parse({})).resolves.toBe('parse'); expect(Object.keys(calls)).toEqual(['retrieve', 'delete', 'cancel', 'parse']); });
  test('covers transport adapter edge paths', () => {
    class CustomSocket { constructor() { this.readyState = 1; this.handlers = {}; } on(event, listener) { this.handlers[event] = listener; } removeListener(event) { delete this.handlers[event]; } send() {} close() {} terminate() { return 'terminated'; } }
    const adapter = new ResponsesWebSocketAdapter({}, { WebSocketImpl: CustomSocket }, {});
    const socket = adapter.socket._createSocket('ws://default', {});
    const values = []; const listener = (value) => values.push(value);
    socket.on('message', listener); socket.socket.handlers.message(Buffer.from('buffer'), true); socket.off('message', listener); socket.off('missing', listener);
    const open = () => {}; const closeListener = (...args) => values.push(args); socket.on('close', closeListener); socket.socket.handlers.close(1000); socket.off('close', closeListener); socket.send('x'); socket.close();
    expect(values[0]).toBe('buffer'); expect(values[1]).toEqual([1000, undefined]); expect(socket.removeAllListeners('missing')).toBe(socket); expect(socket.addEventListener('open', open)).toBe(socket); expect(socket.removeAllListeners('open')).toBe(socket); expect(socket.addEventListener('open', open)).toBe(socket); expect(socket.removeAllListeners()).toBe(socket); expect(socket.removeEventListener('open', open)).toBe(socket); expect(socket.terminate()).toBe('terminated');
    expect(() => new ResponsesWebSocketAdapter({}, { WebSocketImpl: 1 }, {}).socket._createSocket('url', {})).toThrow('constructor');
    expect(adapter.socket._createSocket('url', {}).readyState).toBe(1);
  });
});





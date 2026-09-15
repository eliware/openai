import { jest, expect, test, describe } from '@jest/globals';
class FakeResponsesWS { _createSocket() { return { readyState: 1 }; } constructor() { this.handlers = new Map(); this.sent = []; this.socket = { readyState: 1 }; } send(event) { this.sent.push(event); } async *stream() { for (const event of FakeResponsesWS.events ?? [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'hi' } }, { type: 'message', message: { type: 'response.completed', response: { status: 'completed' } } }]) yield event; FakeResponsesWS.events = undefined; } close(props) { this.closed = props ?? true; } on(event, listener) { this.handlers.set(event, listener); return this; } off(event) { this.handlers.delete(event); return this; } }
jest.unstable_mockModule('openai/resources/responses/ws', () => ({ ResponsesWS: FakeResponsesWS }));
jest.unstable_mockModule('ws', () => ({ WebSocket: class DefaultSocket { constructor() { this.readyState = 1; } on() {} removeListener() {} send() {} close() {} } }));
const { ResponsesWebSocketAdapter } = await import('../../src/responses-websocket/index.mjs');
const make = (http = {}) => new ResponsesWebSocketAdapter({}, {}, http);

describe('ResponsesWebSocketAdapter', () => {
    test('exposes events, metadata, callbacks, and errors', async () => { const adapter = make(); const calls = []; const response = await adapter.createWithEvents({}, { onEvent: event => calls.push(event.type), onTextDelta: delta => calls.push(delta), onCompleted: result => calls.push(result.status) }); expect(response.status).toBe('completed'); expect(calls).toEqual(['response.output_text.delta', 'hi', 'response.completed', 'completed']); FakeResponsesWS.events = [{ type: 'message', message: { type: 'response.failed', error: { code: 'bad', message: 'failed' } } }]; await expect((async () => { for await (const event of adapter.events({})) void event; })()).rejects.toMatchObject({ name: 'ResponsesError', code: 'bad', message: 'failed' }); });
  test('supports injected WebSocket construction and adapter listeners', async () => {
    class CustomSocket { constructor() { this.readyState = 1; this.handlers = {}; } on(event, listener) { this.handlers[event] = listener; } removeListener(event) { delete this.handlers[event]; } send() {} close() {} terminate() { return 'terminated'; } }
    const adapter = new ResponsesWebSocketAdapter({}, { WebSocketImpl: CustomSocket, url: 'ws://custom' }, {});
    const socket = adapter.socket._createSocket('ws://default', { Authorization: 'x' }); expect(socket.readyState).toBe(1);
    socket.send('x'); socket.close(1000, 'ok');
    const message = []; const close = []; const open = () => {}; socket.on('message', data => message.push(data)); socket.on('close', (code, reason) => close.push([code, reason])); socket.on('open', open); socket.socket.handlers.message('text', false); socket.socket.handlers.close(1000, Buffer.from('ok')); socket.off('open', open); expect(message).toEqual(['text']); expect(close).toEqual([[1000, 'ok']]);
    const listener = () => {}; expect(adapter.on('open', listener)).toBe(adapter); expect(adapter.off('open', listener)).toBe(adapter); await adapter.close();
  });
  test('handles abort during an active stream', async () => {
    const adapter = new ResponsesWebSocketAdapter({}, {}, {}); const controller = new AbortController(); adapter.socket.stream = () => { let i = 0; const values = [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'x' } }, { type: 'message', message: { type: 'response.completed', response: {} } }]; return { [Symbol.asyncIterator]() { return this; }, next: async () => i < values.length ? { value: values[i++], done: false } : { done: true }, return: async () => ({ done: false }) }; };
    await expect(adapter.create({}, { signal: controller.signal, onEvent: () => controller.abort() })).rejects.toMatchObject({ name: 'AbortError' });
  });
});
test('waits through the stream readiness strategy and shares pending readiness', async () => {
  const adapter = { socket: { socket: {}, stream: async function* () { yield { type: 'open' }; } }, isOpen: () => false };
  const pending = import('../../src/responses-websocket/lifecycle.mjs').then(({ ready }) => Promise.all([ready(adapter), ready(adapter)]));
  await expect(pending).resolves.toEqual([undefined, undefined]);
});
test('waits through the socket readiness strategy', async () => {
  const handlers = {}; const adapter = { socket: { socket: { on: (name, fn) => { handlers[name] = fn; }, off() {} } }, isOpen: () => false };
  const { ready } = await import('../../src/responses-websocket/lifecycle.mjs'); const pending = ready(adapter);
  handlers.open(); await expect(pending).resolves.toBeUndefined();
});

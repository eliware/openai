import { jest, expect, test, describe } from '@jest/globals';
class FakeResponsesWS { _createSocket() { return { readyState: 1 }; } constructor() { this.handlers = new Map(); this.sent = []; this.socket = { readyState: 1 }; } send(event) { this.sent.push(event); } async *stream() { for (const event of FakeResponsesWS.events ?? [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'hi' } }, { type: 'message', message: { type: 'response.completed', response: { status: 'completed' } } }]) yield event; FakeResponsesWS.events = undefined; } close(props) { this.closed = props ?? true; } on(event, listener) { this.handlers.set(event, listener); return this; } off(event) { this.handlers.delete(event); return this; } }
jest.unstable_mockModule('openai/resources/responses/ws', () => ({ ResponsesWS: FakeResponsesWS }));
const { ResponsesWebSocketAdapter } = await import('./responses-websocket.mjs');
const make = (http = {}) => new ResponsesWebSocketAdapter({}, {}, http);

describe('ResponsesWebSocketAdapter', () => {
  test('creates and streams responses', async () => { const adapter = make(); expect(adapter.socket).toBeInstanceOf(FakeResponsesWS); expect((await adapter.create()).status).toBe('completed'); const events = []; for await (const event of adapter.stream({ model: 'test' })) events.push(event); expect(events).toHaveLength(2); });
  test('exposes events, metadata, callbacks, and errors', async () => { const adapter = make(); const calls = []; const response = await adapter.createWithEvents({}, { onEvent: event => calls.push(event.type), onTextDelta: delta => calls.push(delta), onCompleted: result => calls.push(result.status) }); expect(response.status).toBe('completed'); expect(calls).toEqual(['response.output_text.delta', 'hi', 'response.completed', 'completed']); FakeResponsesWS.events = [{ type: 'message', message: { type: 'response.failed', error: { code: 'bad', message: 'failed' } } }]; await expect((async () => { for await (const event of adapter.events({})) void event; })()).rejects.toMatchObject({ name: 'ResponsesError', code: 'bad', message: 'failed' }); });
  test('supports abort, lifecycle, and socket errors', async () => { const adapter = make(); const controller = new AbortController(); controller.abort(); await expect(adapter.create({}, { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' }); expect(adapter.isOpen()).toBe(true); expect(adapter.state).toBe('open'); await adapter.ready(); FakeResponsesWS.events = [{ type: 'error', error: new Error('socket') }]; await expect(adapter.create({})).rejects.toThrow('socket'); });
  test('delegates HTTP helpers', async () => { const calls = {}; const http = {}; for (const name of ['retrieve', 'delete', 'cancel', 'parse']) http[name] = (...args) => { calls[name] = args; return Promise.resolve(name); }; const adapter = make(http); await expect(adapter.retrieve('id')).resolves.toBe('retrieve'); await expect(adapter.delete('id')).resolves.toBe('delete'); await expect(adapter.cancel('id')).resolves.toBe('cancel'); await expect(adapter.parse({})).resolves.toBe('parse'); expect(Object.keys(calls)).toEqual(['retrieve', 'delete', 'cancel', 'parse']); });
});

test('covers item callbacks and alternate terminal events', async () => {
  const adapter = make(); const seen = [];
  adapter._handleEvent({ type: 'response.output_item.added', item: 1 }, { onItemAdded: item => seen.push(item) });
  adapter._handleEvent({ type: 'response.output_item.done', item: 2 }, { onItemDone: item => seen.push(item) }); expect(seen).toEqual([1, 2]);
  FakeResponsesWS.events = [{ type: 'message', message: { type: 'response.incomplete', incomplete_details: { reason: 'length' } } }];
  await expect(adapter.create({})).rejects.toThrow('length');
  FakeResponsesWS.events = [{ type: 'unknown' }, { type: 'close' }]; await expect(adapter.create({})).rejects.toThrow('closed');
  FakeResponsesWS.events = []; await expect(adapter.create({})).rejects.toThrow('ended');
});

test('covers ready states and event error paths', async () => {
  const adapter = make();
  adapter.socket.socket.readyState = 0; expect(adapter.isOpen()).toBe(false); expect(adapter.state).toBe('connecting');
  adapter.socket.socket.readyState = 2; expect(adapter.state).toBe('closing'); adapter.socket.socket.readyState = 3; expect(adapter.state).toBe('closed');
  const sequences = [[{ type: 'open' }], [{ type: 'error', error: new Error('ready') }], [{ type: 'close' }], []];
  for (const sequence of sequences) { FakeResponsesWS.events = sequence; if (sequence[0]?.type === 'open') await expect(adapter.ready()).resolves.toBeUndefined(); else await expect(adapter.ready()).rejects.toBeTruthy(); }
});

test('supports injected WebSocket construction and adapter listeners', async () => {
  class CustomSocket { constructor() { this.readyState = 1; this.handlers = {}; } on(event, listener) { this.handlers[event] = listener; } removeListener(event) { delete this.handlers[event]; } send() {} close() {} }
  const adapter = new ResponsesWebSocketAdapter({}, { WebSocketImpl: CustomSocket, url: 'ws://custom' }, {});
  const socket = adapter.socket._createSocket('ws://default', { Authorization: 'x' }); expect(socket.readyState).toBe(1);
  socket.send('x'); socket.close(1000, 'ok');
  const message = []; const close = []; const open = () => {}; socket.on('message', data => message.push(data)); socket.on('close', (code, reason) => close.push([code, reason])); socket.on('open', open); socket.socket.handlers.message('text', false); socket.socket.handlers.close(1000, Buffer.from('ok')); socket.off('open', open); expect(message).toEqual(['text']); expect(close).toEqual([[1000, 'ok']]);
  const listener = () => {}; expect(adapter.on('open', listener)).toBe(adapter); expect(adapter.off('open', listener)).toBe(adapter); await adapter.close();
});


test('covers transport adapter edge paths', () => {
  class CustomSocket { constructor() { this.readyState = 1; this.handlers = {}; } on(event, listener) { this.handlers[event] = listener; } removeListener(event) { delete this.handlers[event]; } send() {} close() {} }
  const adapter = new ResponsesWebSocketAdapter({}, { WebSocketImpl: CustomSocket }, {});
  const socket = adapter.socket._createSocket('ws://default', {});
  const values = []; const listener = (value) => values.push(value);
  socket.on('message', listener); socket.socket.handlers.message(Buffer.from('buffer'), true); socket.off('message', listener); socket.off('missing', listener);
  const closeListener = (...args) => values.push(args); socket.on('close', closeListener); socket.socket.handlers.close(1000); socket.off('close', closeListener); socket.send('x'); socket.close();
  expect(values[0]).toBe('buffer'); expect(values[1]).toEqual([1000, undefined]);
  expect(() => new ResponsesWebSocketAdapter({}, { WebSocketImpl: 1 }, {}).socket._createSocket('url', {})).toThrow('constructor');
  expect(adapter.socket._createSocket('url', {}).readyState).toBe(1);
});

test('covers default arguments and fallback branches', async () => {
  const adapter = new ResponsesWebSocketAdapter({});
  expect(adapter.state).toBe('open');
  await expect(adapter.create()).resolves.toMatchObject({ status: 'completed' });
  await expect(adapter.createWithEvents()).resolves.toMatchObject({ status: 'completed' });
  const events = adapter.events(); for await (const event of events) expect(event).toBeTruthy();
  adapter._handleEvent({ type: 'other' }); const emptyStream = adapter.stream(); for await (const event of emptyStream) expect(event).toBeTruthy();
  FakeResponsesWS.events = [{ type: 'message', message: { type: 'response.failed' } }]; await expect(adapter.create({})).rejects.toThrow('Response failed');
  FakeResponsesWS.events = [{ type: 'message', message: { type: 'response.incomplete' } }]; await expect(adapter.create({})).rejects.toThrow('Response incomplete');
  FakeResponsesWS.events = [{ type: 'error' }]; await expect(adapter.create({})).rejects.toThrow('Responses WebSocket error');
  FakeResponsesWS.events = [{ type: 'unknown' }, { type: 'close' }]; await expect(adapter.create({})).rejects.toThrow('closed');
});

test('covers default socket and readiness paths', async () => {
  const adapter = new ResponsesWebSocketAdapter({}, {}, {});
  expect(adapter.socket._createSocket('url', {}).readyState).toBe(1);
  adapter.socket.socket = undefined; expect(adapter.isOpen()).toBe(false); expect(adapter.state).toBe('closed');
  adapter.socket.socket = { readyState: 0 }; FakeResponsesWS.events = [{ type: 'unknown' }, { type: 'close' }]; await expect(adapter.ready()).rejects.toThrow('ready');
  adapter.socket.socket = { readyState: 0 }; FakeResponsesWS.events = [{ type: 'error' }]; await expect(adapter.ready()).rejects.toBeUndefined();
});

test('handles abort during an active stream', async () => {
  const adapter = new ResponsesWebSocketAdapter({}, {}, {}); const controller = new AbortController(); adapter.socket.stream = () => { let i = 0; const values = [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'x' } }, { type: 'message', message: { type: 'response.completed', response: {} } }]; return { [Symbol.asyncIterator]() { return this; }, next: async () => i < values.length ? { value: values[i++], done: false } : { done: true }, return: async () => ({ done: false }) }; };
  await expect(adapter.create({}, { signal: controller.signal, onEvent: () => controller.abort() })).rejects.toMatchObject({ name: 'AbortError' });
});

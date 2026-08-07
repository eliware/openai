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
  adapter.socket.socket = { readyState: 0 }; FakeResponsesWS.events = [{ type: 'error' }]; await expect(adapter.ready()).rejects.toMatchObject({ name: 'ResponsesError', message: 'Responses WebSocket error' });
});

test('handles abort during an active stream', async () => {
  const adapter = new ResponsesWebSocketAdapter({}, {}, {}); const controller = new AbortController(); adapter.socket.stream = () => { let i = 0; const values = [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'x' } }, { type: 'message', message: { type: 'response.completed', response: {} } }]; return { [Symbol.asyncIterator]() { return this; }, next: async () => i < values.length ? { value: values[i++], done: false } : { done: true }, return: async () => ({ done: false }) }; };
  await expect(adapter.create({}, { signal: controller.signal, onEvent: () => controller.abort() })).rejects.toMatchObject({ name: 'AbortError' });
});

test('preserves tool, MCP, and reasoning events through reconnect lifecycle', async () => {
  const adapter = make(); const seen = [];
  FakeResponsesWS.events = [
    { type: 'reconnecting', reconnect: { attempt: 1 } },
    { type: 'reconnected' },
    { type: 'message', message: { type: 'response.function_call_arguments.delta', delta: '{"x":', response_id: 'resp_1', request_id: 'req_1' } },
    { type: 'message', message: { type: 'response.mcp_call_arguments.delta', delta: '1' } },
    { type: 'message', message: { type: 'response.reasoning_summary_text.delta', delta: 'thinking' } },
    { type: 'message', message: { type: 'response.completed', response: { id: 'resp_1' } } },
  ];
  const result = await adapter.createWithEvents({}, { onEvent: event => seen.push(event) });
  expect(result.id).toBe('resp_1');
  expect(seen.map(event => event.type)).toEqual([
    'response.function_call_arguments.delta', 'response.mcp_call_arguments.delta', 'response.reasoning_summary_text.delta', 'response.completed',
  ]);
  expect(seen[0]).toMatchObject({ responseId: 'resp_1', requestId: 'req_1', raw: { type: 'message' } });
});

test('preserves structured protocol error metadata', async () => {
  const adapter = make(); FakeResponsesWS.events = [{ type: 'error', error: { code: 'rate_limit', type: 'server_error', status: 429, param: 'input', request_id: 'req_9', message: 'slow down' } }];
  await expect(adapter.create({})).rejects.toMatchObject({ code: 'rate_limit', type: 'server_error', status: 429, parameter: 'input', requestId: 'req_9', message: 'slow down' });
});

test('normalizes websocket onError lifecycle events', async () => {
  const adapter = make(); const calls = [];
  FakeResponsesWS.events = [{ type: 'error', error: { code: 'bad', request_id: 'req_ws', message: 'failed' } }];
  await expect(adapter.create({}, { onError: (error, event) => calls.push([error, event]) })).rejects.toThrow('failed');
  expect(calls[0][1]).toMatchObject({ type: 'error', requestId: 'req_ws', raw: expect.any(Object) });
});

test('aborting an active websocket request closes its iterator', async () => {
  const adapter = make(); const controller = new AbortController(); let returned = false;
  adapter.socket.stream = () => {
    let resolveNext;
    return {
      [Symbol.asyncIterator]() { return this; },
      next: () => new Promise(resolve => { resolveNext = resolve; }),
      return: async () => { returned = true; resolveNext?.({ done: true }); return { done: true }; },
    };
  };
  const pending = adapter.create({}, { signal: controller.signal });
  controller.abort(new Error('stop'));
  await expect(pending).rejects.toMatchObject({ name: 'Error', message: 'stop' });
  expect(returned).toBe(true);
});

test('close waits for active streams and prevents new requests', async () => {
  const adapter = make(); let returned = false;
  adapter.socket.stream = () => {
    let resolveNext;
    return {
      [Symbol.asyncIterator]() { return this; },
      next: () => new Promise(resolve => { resolveNext = resolve; }),
      return: async () => { returned = true; resolveNext?.({ done: true }); return { done: true }; },
    };
  };
  const pending = adapter.create({});
  await Promise.resolve();
  await adapter.close();
  expect(returned).toBe(true);
  await expect(pending).rejects.toBeTruthy();
  await expect(adapter.create({})).rejects.toMatchObject({ message: 'Responses WebSocket is closed' });
});

test('preserves websocket protocol metadata in callbacks and errors', async () => {
  const adapter = make(); const seen = [];
  FakeResponsesWS.events = [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'x', response_id: 'resp_meta', request_id: 'req_meta' } }, { type: 'message', message: { type: 'response.completed', response: { id: 'resp_meta' }, request_id: 'req_meta' } }];
  await adapter.create({}, { onEvent: event => seen.push(event) });
  expect(seen[0]).toMatchObject({ responseId: 'resp_meta', requestId: 'req_meta', raw: expect.any(Object) });
  FakeResponsesWS.events = [{ type: 'message', message: { type: 'response.failed', error: { code: 'server', request_id: 'req_error', message: 'failed' } } }];
  await expect(adapter.create({})).rejects.toMatchObject({ requestId: 'req_error', event: { raw: expect.any(Object) } });
});

test('covers NodeSocketAdapter once and non-abort iterator failures', async () => {
  class CustomSocket {
    constructor() { this.readyState = 1; this.handlers = new Map(); }
    on(event, listener) { this.handlers.set(event, listener); }
    removeListener(event) { this.handlers.delete(event); }
    send() {}
    close() {}
    trigger(event, ...args) { this.handlers.get(event)?.(...args); }
  }
  const adapter = new ResponsesWebSocketAdapter({}, { WebSocketImpl: CustomSocket, url: 'ws://test' }, {});
  const socket = adapter.socket._createSocket('ws://test', {}); let opened = 0;
  socket.once('open', () => { opened += 1; }); socket.socket.trigger('open'); expect(opened).toBe(1);
  adapter.socket.stream = () => ({
    [Symbol.asyncIterator]() { return this; },
    next: async () => { throw new Error('iterator failed'); },
    return: async () => ({ done: true }),
  });
  await expect(adapter.create({})).rejects.toThrow('iterator failed');
});

test('covers close completion and close error callbacks', async () => {
  const complete = make();
  complete.socket.socket = { readyState: 1, once(event, listener) { if (event === 'close') listener(); }, removeListener() {}, close() {} };
  await complete.close();

  const failed = make();
  failed.socket.socket = { readyState: 1, once(event, listener) { if (event === 'error') listener(new Error('close failed')); }, removeListener() {}, close() {} };
  await expect(failed.close()).rejects.toThrow('close failed');
});

test('covers repeated close and idempotent close callback', async () => {
  const adapter = make();
  await adapter.close();
  await expect(adapter.close()).resolves.toBeUndefined();
  const callbacks = make();
  callbacks.socket.socket = {
    readyState: 1,
    once(event, listener) { if (event === 'close') { listener(); listener(); } },
    removeListener() {},
    close() {},
  };
  await callbacks.close();
});

test('covers already-closing socket close completion', async () => {
  const adapter = make();
  adapter.socket.socket = {
    readyState: 3,
    once(event, listener) { if (event === 'close') listener(); },
    removeListener() {},
    close() {},
  };
  await adapter.close();
});

test('covers request options default', async () => {
  const adapter = make();
  FakeResponsesWS.events = [{ type: 'message', message: { type: 'response.completed', response: {} } }];
  const events = adapter._request({});
  for await (const event of events) expect(event).toBeTruthy();
});

test('shares pending readiness work', async () => {
  const adapter = make();
  adapter.socket.socket = { readyState: 0 };
  let resolveNext;
  adapter.socket.stream = () => ({
    [Symbol.asyncIterator]() { return this; },
    next() { return new Promise(resolve => { resolveNext = resolve; }); },
    return() { return Promise.resolve({ done: true }); },
  });
  const first = adapter.ready();
  const second = adapter.ready();
  resolveNext({ value: { type: 'open' }, done: false });
  await Promise.all([first, second]);
});

test('closes sockets without once support', async () => {
  const adapter = make();
  adapter.socket.socket = { readyState: 1, once: undefined };
  adapter.socket.close = () => {};
  await adapter.close();
});

test('handles close failure', async () => {
  const adapter = make();
  adapter.socket.close = () => { throw new Error('close failed'); };
  await expect(adapter.close()).rejects.toThrow('close failed');
});

test('supports AgentX lifecycle callbacks', () => {
  const adapter = make(); const calls = [];
  const handlers = {
    onEvent: (_event, raw) => calls.push(['event', raw]),
    onResponseCreated: value => calls.push(['created', value]),
    onResponseProgress: value => calls.push(['progress', value]),
    onContentPartAdded: value => calls.push(['part+', value]),
    onContentPartDone: value => calls.push(['part-', value]),
    onTextDone: value => calls.push(['text-', value]),
    onResponseCompleted: value => calls.push(['completed', value]),
  };
  for (const event of [
    { type: 'response.created', response: { id: 'r' } },
    { type: 'response.in_progress', response: { id: 'r' } },
    { type: 'response.content_part.added', part: { type: 'text' } },
    { type: 'response.content_part.done', part: { type: 'text' } },
    { type: 'response.output_text.done', text: 'done' },
    { type: 'response.completed', response: { id: 'r' }, raw: { wire: true } },
  ]) adapter._handleEvent(event, handlers);
  expect(calls).toHaveLength(12);
});

test('bounds close and terminates an unresponsive socket', async () => {
  const adapter = make(); let terminated = 0;
  adapter.socket.socket = { readyState: 1, once(event, listener) { this[event] = listener; }, removeListener() {}, terminate() { terminated += 1; } };
  adapter.socket.close = () => {};
  await expect(adapter.close({ timeout: 1 })).rejects.toMatchObject({ name: 'ResponsesError', message: 'Responses WebSocket close timed out', code: 'timeout' });
  expect(terminated).toBe(1);
});

test('fires completion callbacks once each', async () => {
  FakeResponsesWS.events = [{ type: 'message', message: { type: 'response.completed', response: { id: 'r' } } }];
  const adapter = make(); const calls = [];
  await adapter.create({}, { onCompleted: () => calls.push('completed'), onResponseCompleted: () => calls.push('responseCompleted') });
  expect(calls).toEqual(['responseCompleted', 'completed']);
});

test('accepts null close options', async () => {
  const adapter = make();
  adapter.socket.socket = { readyState: 1 };
  await adapter.close(null);
});

import { jest, expect, test, describe } from '@jest/globals';
class FakeResponsesWS { _createSocket() { return { readyState: 1 }; } constructor() { this.handlers = new Map(); this.sent = []; this.socket = { readyState: 1 }; } send(event) { this.sent.push(event); } async *stream() { for (const event of FakeResponsesWS.events ?? [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'hi' } }, { type: 'message', message: { type: 'response.completed', response: { status: 'completed' } } }]) yield event; FakeResponsesWS.events = undefined; } close(props) { this.closed = props ?? true; } on(event, listener) { this.handlers.set(event, listener); return this; } off(event) { this.handlers.delete(event); return this; } }
jest.unstable_mockModule('openai/resources/responses/ws', () => ({ ResponsesWS: FakeResponsesWS }));
jest.unstable_mockModule('ws', () => ({ WebSocket: class DefaultSocket { constructor() { this.readyState = 1; } on() {} removeListener() {} send() {} close() {} } }));
const { ResponsesWebSocketAdapter } = await import('../../src/responses-websocket/index.mjs');
const make = (http = {}) => new ResponsesWebSocketAdapter({}, {}, http);
const { requestEvents } = await import('../../src/responses-websocket/request.mjs');
const { steerResponse } = await import('../../src/responses-websocket/request/steer.mjs');
const { continueResponse } = await import('../../src/responses-websocket/request/continue-response.mjs');

describe('ResponsesWebSocketAdapter', () => {
    test('creates and streams responses', async () => { const adapter = make(); expect(adapter.socket).toBeInstanceOf(FakeResponsesWS); expect((await adapter.create()).status).toBe('completed'); const events = []; for await (const event of adapter.stream({ model: 'test' })) events.push(event); expect(events).toHaveLength(2); });
  test('covers ready states and event error paths', async () => {
    const adapter = make();
    adapter.socket.socket.readyState = 0; expect(adapter.isOpen()).toBe(false); expect(adapter.state).toBe('connecting');
    adapter.socket.socket.readyState = 2; expect(adapter.state).toBe('closing'); adapter.socket.socket.readyState = 3; expect(adapter.state).toBe('closed');
    const sequences = [[{ type: 'open' }], [{ type: 'error', error: new Error('ready') }], [{ type: 'close' }], []];
    for (const sequence of sequences) { FakeResponsesWS.events = sequence; if (sequence[0]?.type === 'open') await expect(adapter.ready()).resolves.toBeUndefined(); else await expect(adapter.ready()).rejects.toBeTruthy(); }
  });
  test('covers default socket and readiness paths', async () => {
    const adapter = new ResponsesWebSocketAdapter({}, {}, {});
    expect(adapter.socket._createSocket('url', {}).readyState).toBe(1);
    adapter.socket.socket = undefined; expect(adapter.isOpen()).toBe(false); expect(adapter.state).toBe('closed');
    adapter.socket.socket = { readyState: 0 }; FakeResponsesWS.events = [{ type: 'unknown' }, { type: 'close' }]; await expect(adapter.ready()).rejects.toThrow('ready');
    adapter.socket.socket = { readyState: 0 }; FakeResponsesWS.events = [{ type: 'error' }]; await expect(adapter.ready()).rejects.toMatchObject({ name: 'ResponsesError', message: 'Responses WebSocket error' });
  });
});

test('rejects pre-aborted requests and cleans request state', async () => {
  const controller = new AbortController(); controller.abort(); const errors = [];
  const adapter = { _requestActive: false, _activeStreams: new Set(), socket: { stream: async function* () {} }, ready: async () => {}, isOpen: () => true };
  await expect((async () => { for await (const event of requestEvents(adapter, {}, { signal: controller.signal, onError: error => errors.push(error) })) void event; })()).rejects.toMatchObject({ name: 'AbortError' });
  expect(errors).toHaveLength(1); expect(adapter._requestActive).toBe(false);
});

test('normalizes send failures and incomplete streams', async () => {
  const makeAdapter = (events, send = () => {}) => ({ _requestActive: false, _activeStreams: new Set(), socket: { stream: async function* () { yield* events; }, send }, ready: async () => {}, isOpen: () => true });
  const sendAdapter = makeAdapter([], () => { throw new Error('send failed'); });
  await expect((async () => { for await (const event of requestEvents(sendAdapter, {})) void event; })()).rejects.toThrow('send failed');
  const incompleteAdapter = makeAdapter([{ type: 'message', message: { type: 'response.incomplete', response: { incomplete_details: { reason: 'length' } } } }]);
  await expect((async () => { for await (const event of requestEvents(incompleteAdapter, {})) void event; })()).rejects.toThrow('length');
});

test('steers an active GPT-6 response and continues after required tool input', async () => {
  const sent = []; const collected = [];
  const events = [
    { type: 'message', message: { type: 'response.created', response: { id: 'r1' } } },
    { type: 'message', message: { type: 'response.steer.accepted', steer: { previous_response_id: 'r1' } } },
    { type: 'message', message: { type: 'response.completed', response: { id: 'r1' } } },
    { type: 'message', message: { type: 'response.steer.pending', steer: { previous_response_id: 'r1' }, required_input: [{ type: 'function_call_output', call_id: 'call1' }] } },
    { type: 'message', message: { type: 'response.created', response: { id: 'r2', previous_response_id: 'r1' } } },
    { type: 'message', message: { type: 'response.completed', response: { id: 'r2' } } },
  ];
  const adapter = { _activeRequest: null, _activeStreams: new Set(), socket: { stream: async function* () { yield* events; }, send: event => sent.push(event) }, ready: async () => {}, isOpen: () => true };
  const handlers = { onEvent: event => {
    if (event.type === 'response.created' && event.response.id === 'r1') steerResponse(adapter, 'r1', 'Keep the plan concise.');
    if (event.type === 'response.steer.pending') continueResponse(adapter, { previous_response_id: 'r1', input: [{ type: 'function_call_output', call_id: 'call1', output: 'complete' }] });
  } };
  for await (const event of requestEvents(adapter, { model: 'gpt-6-astra' }, handlers)) collected.push(event.type);
  expect(collected).toEqual(['response.created', 'response.steer.accepted', 'response.completed', 'response.steer.pending', 'response.created', 'response.completed']);
  expect(sent).toEqual([
    { type: 'response.create', model: 'gpt-6-astra' },
    { type: 'response.steer', previous_response_id: 'r1', input: 'Keep the plan concise.' },
    { type: 'response.create', previous_response_id: 'r1', input: [{ type: 'function_call_output', call_id: 'call1', output: 'complete' }] },
  ]);
});

test('accepts steering sent after observing a completed response', async () => {
  const sent = []; const events = [
    { type: 'message', message: { type: 'response.created', response: { id: 'r1' } } },
    { type: 'message', message: { type: 'response.completed', response: { id: 'r1' } } },
    { type: 'message', message: { type: 'response.steer.accepted', steer: { previous_response_id: 'r1' } } },
    { type: 'message', message: { type: 'response.created', response: { id: 'r2', previous_response_id: 'r1' } } },
    { type: 'message', message: { type: 'response.completed', response: { id: 'r2' } } },
  ];
  const adapter = { _activeRequest: null, _activeStreams: new Set(), socket: { stream: async function* () { yield* events; }, send: event => sent.push(event) }, ready: async () => {}, isOpen: () => true };
  const result = [];
  for await (const event of requestEvents(adapter, { model: 'gpt-6-astra' })) {
    result.push(event.type);
    if (event.type === 'response.completed' && event.response.id === 'r1') steerResponse(adapter, 'r1', 'One more adjustment.');
  }
  expect(result).toHaveLength(5);
  expect(sent[1]).toEqual({ type: 'response.steer', previous_response_id: 'r1', input: 'One more adjustment.' });
});

test('rejects reconnect and transport close events', async () => {
  for (const event of [{ type: 'reconnecting' }, { type: 'close' }]) {
    const adapter = { _requestActive: false, _activeStreams: new Set(), socket: { stream: async function* () { yield event; }, send() {} }, ready: async () => {}, isOpen: () => true };
    await expect((async () => { for await (const value of requestEvents(adapter, {})) void value; })()).rejects.toBeInstanceOf(Error);
  }
});

test('normalizes readiness failures and ended streams', async () => {
  const base = { _requestActive: false, _activeStreams: new Set(), socket: { stream: async function* () {}, send() {} }, isOpen: () => true };
  const failed = { ...base, ready: async () => { throw new Error('not ready'); } };
  await expect((async () => { for await (const value of requestEvents(failed, {})) void value; })()).rejects.toThrow('not ready');
  const ended = { ...base, ready: async () => {}, socket: { stream: async function* () {}, send() {} } };
  await expect((async () => { for await (const value of requestEvents(ended, {})) void value; })()).rejects.toThrow('ended before completion');
});

test('rejects concurrent requests', async () => {
  const adapter = { _requestActive: true, _activeStreams: new Set(), socket: { stream: async function* () {} } };
  await expect((async () => { for await (const value of requestEvents(adapter, {})) void value; })()).rejects.toThrow('Concurrent Responses WebSocket requests');
});

test('rejects when abort occurs after readiness', async () => {
  const controller = new AbortController();
  const adapter = { _requestActive: false, _activeStreams: new Set(), socket: { stream: async function* () {}, send() {} }, ready: async () => controller.abort(), isOpen: () => true };
  await expect((async () => { for await (const value of requestEvents(adapter, {}, { signal: controller.signal })) void value; })()).rejects.toMatchObject({ name: 'AbortError' });
});

import { jest, expect, test, describe } from '@jest/globals';
class FakeResponsesWS { _createSocket() { return { readyState: 1 }; } constructor() { this.handlers = new Map(); this.sent = []; this.socket = { readyState: 1 }; } send(event) { this.sent.push(event); } async *stream() { for (const event of FakeResponsesWS.events ?? [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'hi' } }, { type: 'message', message: { type: 'response.completed', response: { status: 'completed' } } }]) yield event; FakeResponsesWS.events = undefined; } close(props) { this.closed = props ?? true; } on(event, listener) { this.handlers.set(event, listener); return this; } off(event) { this.handlers.delete(event); return this; } }
jest.unstable_mockModule('openai/resources/responses/ws', () => ({ ResponsesWS: FakeResponsesWS }));
jest.unstable_mockModule('ws', () => ({ WebSocket: class DefaultSocket { constructor() { this.readyState = 1; } on() {} removeListener() {} send() {} close() {} } }));
const { ResponsesWebSocketAdapter } = await import('../../src/responses-websocket/index.mjs');
const make = (http = {}) => new ResponsesWebSocketAdapter({}, {}, http);

describe('ResponsesWebSocketAdapter', () => {
    test('exposes the SDK transport only through the internal boundary', async () => { const { ResponsesWS: BoundaryResponsesWS } = await import('../../src/transports/responses-websocket.mjs'); expect(BoundaryResponsesWS).toBe(FakeResponsesWS); });
  test('covers item callbacks and alternate terminal events', async () => {
    const adapter = make(); const seen = [];
    adapter._handleEvent({ type: 'response.output_item.added', item: 1 }, { onItemAdded: item => seen.push(item) });
    adapter._handleEvent({ type: 'response.output_item.done', item: 2 }, { onItemDone: item => seen.push(item) }); expect(seen).toEqual([1, 2]);
    FakeResponsesWS.events = [{ type: 'message', message: { type: 'response.incomplete', incomplete_details: { reason: 'length' } } }];
    await expect(adapter.create({})).rejects.toThrow('length');
    FakeResponsesWS.events = [{ type: 'unknown' }, { type: 'close' }]; await expect(adapter.create({})).rejects.toThrow('closed');
    FakeResponsesWS.events = []; await expect(adapter.create({})).rejects.toThrow('ended');
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
  test('covers closed, streaming, and request facade paths', async () => {
    FakeResponsesWS.events = undefined;
    const adapter = new ResponsesWebSocketAdapter({});
    const streamed = adapter.create({ stream: true }); const values = []; for await (const event of streamed) values.push(event); expect(values.length).toBeGreaterThan(0);
    await expect(adapter.createWithEvents({ stream: true })).resolves.toBeUndefined();
    const streamedAgain = adapter.stream({ model: 'test', onEvent: () => {} }, { onCompleted: () => {} }); for await (const event of streamedAgain) void event;
    const request = adapter._request({}); await request.next();
    adapter._closed = true; await expect(adapter.create()).rejects.toThrow('closed');
  });
});

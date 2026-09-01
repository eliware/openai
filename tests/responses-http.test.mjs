import { expect, test } from '@jest/globals';
import { createHTTPResponsesAdapter } from './index.mjs';

const response = { id: 'resp_1', object: 'response', output: [] };

test('normalizes HTTP non-streaming callbacks', async () => {
  const calls = [];
  const adapter = createHTTPResponsesAdapter({ create: async () => response });
  await expect(adapter.create({}, { onEvent: event => calls.push(event), onCompleted: value => calls.push(value) })).resolves.toBe(response);
  expect(calls[0]).toMatchObject({ type: 'response.completed', responseId: 'resp_1' });
  expect(calls[1]).toBe(response);
});

test('normalizes HTTP streaming events and callbacks', async () => {
  const calls = [];
  const adapter = createHTTPResponsesAdapter({
    create: async () => (async function* () {
      yield { type: 'response.output_text.delta', delta: 'hi', response_id: 'resp_2' };
      yield { type: 'response.completed', response: { id: 'resp_2' } };
    })(),
    stream: async function* () { yield { type: 'response.output_text.delta', delta: 'x' }; },
  });
  const events = [];
  for await (const event of adapter.events({}, { onEvent: event => calls.push(event), onTextDelta: delta => events.push(delta) })) events.push(event);
  expect(events[0]).toBe('hi');
  expect(calls[0]).toMatchObject({ responseId: 'resp_2', raw: expect.any(Object) });
});

test('reports HTTP callback errors', async () => {
  const error = new Error('bad'); const calls = [];
  const adapter = createHTTPResponsesAdapter({ create: async () => { throw error; } });
  await expect(adapter.create({}, { onError: (value, event) => calls.push([value, event]) })).rejects.toMatchObject({ name: 'ResponsesError', cause: error, message: 'bad' });
  expect(calls[0][1]).toMatchObject({ type: 'error', error: expect.any(Object) });
});

test('wraps HTTP failures as ResponsesError with SDK metadata', async () => {
  const calls = [];
  const apiError = Object.assign(new Error('rate limited'), {
    status: 429, code: 'rate_limit', type: 'api_error', param: 'input', requestID: 'req_http',
  });
  const adapter = createHTTPResponsesAdapter({ create: async () => { throw apiError; } });
  await expect(adapter.create({}, { onError: (error, event) => calls.push([error, event]) })).rejects.toMatchObject({
    name: 'ResponsesError', message: 'rate limited', status: 429, code: 'rate_limit',
    type: 'api_error', parameter: 'input', requestId: 'req_http', cause: apiError,
  });
  expect(calls[0][1]).toMatchObject({ type: 'error', requestId: 'req_http', raw: expect.any(Object) });
});

test('passes AbortSignal to HTTP non-streaming and streaming requests', async () => {
  const controller = new AbortController(); const calls = [];
  const adapter = createHTTPResponsesAdapter({
    create: async (_input, options) => { calls.push(options.signal); return { id: 'resp' }; },
    stream: async function* (_input, options) { calls.push(options.signal); yield { type: 'response.completed', response: { id: 'resp' } }; },
  });
  await adapter.create({}, { signal: controller.signal });
  for await (const event of adapter.stream({}, { signal: controller.signal })) void event;
  expect(calls).toEqual([controller.signal, controller.signal]);
});

test('HTTP abort rejects with the caller abort reason', async () => {
  const controller = new AbortController();
  const reason = new Error('cancelled');
  const adapter = createHTTPResponsesAdapter({ create: async (_input, options) => {
    await new Promise((_, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true }));
  } });
  const pending = adapter.create({}, { signal: controller.signal });
  controller.abort(reason);
  await expect(pending).rejects.toMatchObject({ name: 'ResponsesError', cause: reason, message: 'cancelled' });
});

test('preserves HTTP event and server metadata', async () => {
  const seen = [];
  const adapter = createHTTPResponsesAdapter({
    create: async function* () {
      yield { type: 'response.output_text.delta', delta: 'x', response_id: 'resp_meta', request_id: 'req_meta', server_error: { code: 'none' } };
    },
  });
  for await (const event of adapter.events({}, { onEvent: value => seen.push(value) })) void event;
  expect(seen[0]).toMatchObject({ responseId: 'resp_meta', requestId: 'req_meta', raw: expect.any(Object), server_error: { code: 'none' } });
});

test('covers createWithEvents streaming and item callbacks', async () => {
  const calls = [];
  const adapter = createHTTPResponsesAdapter({ create: async function* () {
    yield { type: 'response.output_item.added', item: { id: 'item_1' } };
    yield { type: 'response.output_item.done', item: { id: 'item_1' } };
  } });
  await adapter.createWithEvents({ stream: true }, {
    onItemAdded: item => calls.push(['added', item.id]),
    onItemDone: item => calls.push(['done', item.id]),
  });
  expect(calls).toEqual([['added', 'item_1'], ['done', 'item_1']]);
  await expect(adapter.createWithEvents({}, {})).resolves.toBeTruthy();
});

test('wraps HTTP stream errors and calls onError', async () => {
  const error = Object.assign(new Error('stream failed'), { status: 502, requestID: 'req_stream' });
  const calls = [];
  const adapter = createHTTPResponsesAdapter({ stream: async () => { throw error; } });
  const stream = adapter.stream({}, { onError: (value, event) => calls.push([value, event]) });
  await expect((async () => { for await (const event of stream) void event; })()).rejects.toMatchObject({
    name: 'ResponsesError', status: 502, requestId: 'req_stream', cause: error,
  });
  expect(calls[0][1]).toMatchObject({ type: 'error', requestId: 'req_stream' });
});

test('covers HTTP adapter defaults, request options, and every callback branch', async () => {
  const calls = [];
  const events = [
    { type: 'response.output_text.delta', delta: 'text' },
    { type: 'response.output_item.added', item: { id: 'added' } },
    { type: 'response.output_item.done', item: { id: 'done' } },
    { type: 'response.completed', response: { id: 'resp' } },
  ];
  const source = {
    create: async input => input.stream ? events : { id: 'default' },
    stream: async () => events,
  };
  const adapter = createHTTPResponsesAdapter(source);
  await adapter.create();
  await adapter.createWithEvents();
  for await (const event of adapter.events()) void event;
  for await (const event of adapter.stream()) void event;
  for await (const event of adapter.create({ stream: true }, {
    signal: 'signal', onEvent: event => calls.push(event.type), onTextDelta: value => calls.push(value),
    onItemAdded: item => calls.push(item.id), onItemDone: item => calls.push(item.id), onCompleted: value => calls.push(value.id),
  })) void event;
  expect(calls).toEqual(['response.output_text.delta', 'text', 'response.output_item.added', 'added', 'response.output_item.done', 'done', 'response.completed', 'resp']);
});

test('supports AgentX lifecycle callbacks over HTTP', async () => {
  const calls = [];
  const adapter = createHTTPResponsesAdapter({ create: async function* () {
    yield { type: 'response.created', response: { id: 'r' } };
    yield { type: 'response.in_progress', response: { id: 'r' } };
    yield { type: 'response.content_part.added', part: {} };
    yield { type: 'response.content_part.done', part: {} };
    yield { type: 'response.output_text.done', text: 'done' };
    yield { type: 'response.completed', response: { id: 'r' } };
  } });
  await adapter.createWithEvents({ stream: true }, {
    onResponseCreated: value => calls.push(value), onResponseProgress: value => calls.push(value),
    onContentPartAdded: value => calls.push(value), onContentPartDone: value => calls.push(value),
    onTextDone: value => calls.push(value), onResponseCompleted: value => calls.push(value),
  });
  expect(calls).toHaveLength(6);
});

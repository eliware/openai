import { expect, test } from '@jest/globals';
import { createMockResponsesTransport } from '../src/mock-transport.mjs';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

test('mock transport emits open, messages, and close', async () => {
  const Mock = createMockResponsesTransport([{ type: 'test' }]); const socket = new Mock(); const seen = [];
  socket.on('open', () => seen.push('open')); socket.on('message', data => seen.push(JSON.parse(data).type)); socket.on('close', (code, reason) => seen.push(`${code}:${reason}`)); socket.send();
  await tick(); socket.close(); expect(seen).toEqual(['open', 'test', '1000:OK']);
});

test('supports delayed events, sent payloads, errors, reconnects, and listeners', async () => {
  const Mock = createMockResponsesTransport([{ type: 'response.output_text.delta', delta: 'hi' }], { autoOpen: false, delay: 1 });
  const socket = new Mock('ws://test'); const seen = []; const onClose = (code) => seen.push(`close:${code}`);
  socket.once('open', () => seen.push('open')); socket.on('message', data => seen.push(JSON.parse(data).type)); socket.on('close', onClose);
  expect(socket.readyState).toBe(0); socket.readyState = 1; socket.emit('open'); socket.send(JSON.stringify({ type: 'response.create' })); await new Promise(resolve => setTimeout(resolve, 5));
  expect(socket.sent).toEqual([{ type: 'response.create' }]); expect(seen).toEqual(['open', 'response.output_text.delta']);
  socket.error(new Error('boom')); socket.reconnect(); expect(seen).toContain('close:1006'); socket.removeListener('close', onClose); socket.close(1001, 'done'); expect(socket.closed).toEqual({ code: 1001, reason: 'done' });
});

test('supports empty events and explicit close arguments', async () => {
  const Mock = createMockResponsesTransport(); const socket = new Mock(); const close = [];
  socket.on('close', (...args) => close.push(args)); socket.send(); await tick(); socket.close(1001, 'bye');
  expect(close).toEqual([[1001, 'bye']]); expect(socket.readyState).toBe(3);
});

test('supports AgentX protocol scenario events', async () => {
  const scenario = [
    { type: 'response.output_text.delta', delta: 'hello' },
    { type: 'response.function_call_arguments.delta', item_id: 'call_1', delta: '{' },
    { type: 'response.shell_call.command.delta', item_id: 'call_2', delta: 'ls' },
    { type: 'response.mcp_call_arguments.delta', item_id: 'call_3', delta: '{}' },
    { type: 'response.reasoning_summary_text.delta', delta: 'thinking' },
    { type: 'response.output_item.added', item: { id: 'call_1', type: 'function_call' } },
    { type: 'response.output_item.done', item: { id: 'call_1', type: 'function_call' } },
    { type: 'response.completed', response: { id: 'resp_1' } },
  ];
  const Mock = createMockResponsesTransport(scenario); const socket = new Mock(); const seen = [];
  socket.on('message', data => seen.push(JSON.parse(data).type)); socket.send('{}'); await new Promise(resolve => setTimeout(resolve, 5));
  expect(seen).toEqual(scenario.map(event => event.type));
  socket.reconnect(); socket.error(); socket.close(1001, 'done');
  expect(socket.closed).toEqual({ code: 1001, reason: 'done' });
});

test('covers mock transport fallback branches and dynamic event factory', async () => {
  const generated = [];
  const Mock = createMockResponsesTransport([], { autoOpen: false, events: (data, socket) => {
    generated.push([data, socket]); return [{ type: 'generated' }];
  } });
  const socket = new Mock(); const seen = [];
  socket.on('message', value => seen.push(JSON.parse(value).type));
  socket.send({ type: 'object' }); socket.push({ type: 'pushed' }); socket.off('missing', () => {}); socket.emit('unused');
  socket.error(); socket.error(new Error('explicit')); await new Promise(resolve => setTimeout(resolve, 2));
  expect(generated[0][0]).toEqual({ type: 'object' }); expect(seen).toContain('generated'); expect(seen).toContain('pushed');
  socket.close(); socket.close(); expect(socket.closed.code).toBe(1000);
});

test('covers mock defaults and once/off lifecycle', async () => {
  const Mock = createMockResponsesTransport(); const socket = new Mock(); let opens = 0;
  socket.once('open', () => { opens += 1; });
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(opens).toBe(1); expect(Mock.instances).toContain(socket);
  socket.on('unused', () => {}).off('unused', () => {});
  socket.removeListener('missing', () => {}); socket.emit('missing');
});

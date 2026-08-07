import { expect, test } from '@jest/globals';
import { createMockResponsesTransport } from './mock-transport.mjs';

test('mock transport emits open, messages, and close', async () => {
  const Mock = createMockResponsesTransport([{ type: 'test' }]); const socket = new Mock(); const seen = [];
  const onOpen = () => seen.push('open'); const onMessage = data => seen.push(JSON.parse(data).type); const onClose = (code, reason) => seen.push(`${code}:${reason}`);
  socket.on('open', onOpen); socket.on('message', onMessage); socket.on('close', onClose); socket.send();
  await new Promise(resolve => setTimeout(resolve, 0)); socket.close();
  expect(seen).toEqual(['open', 'test', '1000:OK']);
  socket.removeListener('close', onClose); socket.removeListener('missing', () => {}); socket.emit('close', 1001, 'gone'); expect(seen).toHaveLength(3);
});

test('supports empty events and explicit close arguments', async () => {
  const Mock = createMockResponsesTransport(); const socket = new Mock(); const close = [];
  socket.on('close', (...args) => close.push(args)); socket.send(); await new Promise(resolve => setTimeout(resolve, 0)); socket.close(1001, 'bye');
  expect(close).toEqual([[1001, 'bye']]); expect(socket.readyState).toBe(3);
});

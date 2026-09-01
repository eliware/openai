import { describe, expect, test } from '@jest/globals';
import { WebSocketServer } from 'ws';
import { createServer } from 'node:http';
import { createOpenAI } from '../src/client.mjs';

describe('local WebSocket integration', () => {
  test('uses the real SDK transport against a deterministic local server', async () => {
    const server = new WebSocketServer({ port: 0 });
    await new Promise(resolve => server.once('listening', resolve));
    server.on('connection', socket => socket.on('message', () => {
      socket.send(JSON.stringify({ type: 'response.completed', response: { id: 'local-response', status: 'completed' } }));
    }));
    const { port } = server.address();
    const client = createOpenAI({ apiKey: 'integration-key', transport: 'websocket', url: `ws://127.0.0.1:${port}` });
    try {
      await expect(client.responses.create({ model: 'integration-model' })).resolves.toMatchObject({ id: 'local-response', status: 'completed' });
    } finally {
      await client.responses.close();
      await new Promise(resolve => server.close(resolve));
    }
  }, 10_000);
});

test('uses the real SDK HTTP transport against a deterministic local server', async () => {
  const server = createServer((_request, response) => {
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify({ id: 'local-http-response', status: 'completed' }));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const client = createOpenAI({ apiKey: 'integration-key', baseURL: `http://127.0.0.1:${port}/v1` });
  try {
    await expect(client.responses.create({ model: 'integration-model' })).resolves.toMatchObject({ id: 'local-http-response' });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}, 10_000);

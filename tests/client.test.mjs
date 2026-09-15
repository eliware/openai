import { jest, test, expect, describe, afterEach } from '@jest/globals';
import { WebSocketServer } from 'ws';
import { createServer } from 'node:http';
class FakeResponsesWS {
  constructor() { this.handlers = new Map(); this.sent = []; this.closed = false; this.socket = { readyState: 1 }; }
  send(event) { this.sent.push(event); }
  async *stream() { for (const event of FakeResponsesWS.events ?? [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'hi' } }, { type: 'message', message: { type: 'response.completed', response: { status: 'completed' } } }]) yield event; FakeResponsesWS.events = undefined; }
  close(props) { this.closed = props ?? true; }
  on(event, listener) { this.handlers.set(event, listener); return this; }
  off(event) { this.handlers.delete(event); return this; }
}
jest.unstable_mockModule('openai/resources/responses/ws', () => ({ ResponsesWS: FakeResponsesWS }));
const { createOpenAI } = await import('../src/client.mjs');
afterEach(() => { delete process.env.OPENAI_API_KEY; delete process.env.AZURE_OPENAI_API_KEY; delete process.env.AZURE_OPENAI_ENDPOINT; delete process.env.OPENAI_API_VERSION; FakeResponsesWS.events = undefined; });

describe('createOpenAI', () => {
  test('validates and accepts options', () => { expect(() => createOpenAI()).toThrow('API key'); expect(createOpenAI('test-key').apiKey).toBe('test-key'); process.env.OPENAI_API_KEY = 'env-key'; const client = createOpenAI({ baseURL: 'https://example.test', timeout: 1234, maxRetries: 2 }); expect(client.apiKey).toBe('env-key'); expect(client.baseURL).toBe('https://example.test'); expect(() => createOpenAI(123)).toThrow('options'); expect(() => createOpenAI({ apiKey: '  ' })).toThrow('API key'); });
  test('handles transport selection', () => { expect(createOpenAI({ apiKey: 'key', transport: 'http' }).apiKey).toBe('key'); expect(() => createOpenAI({ apiKey: 'key', transport: 'ftp' })).toThrow('Unsupported transport'); });
  test('creates websocket client with streaming APIs', async () => { const client = createOpenAI({ apiKey: 'key', transport: 'websocket', maxQueueSize: 2 }); const stream = []; for await (const event of client.responses.create({ model: 'test', stream: true })) stream.push(event); expect(stream).toHaveLength(2); await expect(client.responses.create({ model: 'test' })).resolves.toMatchObject({ status: 'completed' }); const listener = () => {}; client.responses.on('error', listener).off('error', listener); await client.responses.close(); });
});

describe('local transport integration', () => {
  test('uses the real SDK WebSocket transport against a deterministic server', async () => {
    const server = new WebSocketServer({ port: 0 });
    await new Promise(resolve => server.once('listening', resolve));
    server.on('connection', socket => socket.on('message', () => socket.send(JSON.stringify({ type: 'response.completed', response: { id: 'local-response', status: 'completed' } }))));
    const { port } = server.address();
    const client = createOpenAI({ apiKey: 'integration-key', transport: 'websocket', url: `ws://127.0.0.1:${port}` });
    try { await expect(client.responses.create({ model: 'integration-model' })).resolves.toMatchObject({ status: 'completed' }); }
    finally { await client.responses.close(); await new Promise(resolve => server.close(resolve)); }
  }, 10_000);

  test('uses the real SDK HTTP transport against a deterministic server', async () => {
    const server = createServer((_request, response) => { response.setHeader('content-type', 'application/json'); response.end(JSON.stringify({ id: 'local-http-response', status: 'completed' })); });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    const client = createOpenAI({ apiKey: 'integration-key', baseURL: `http://127.0.0.1:${port}/v1` });
    try { await expect(client.responses.create({ model: 'integration-model' })).resolves.toMatchObject({ id: 'local-http-response' }); }
    finally { await new Promise(resolve => server.close(resolve)); }
  }, 10_000);
});


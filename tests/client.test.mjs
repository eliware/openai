import { jest, test, expect, describe, afterEach } from '@jest/globals';
class FakeResponsesWS {
  constructor() { this.handlers = new Map(); this.sent = []; this.closed = false; this.socket = { readyState: 1 }; }
  send(event) { this.sent.push(event); }
  async *stream() { for (const event of FakeResponsesWS.events ?? [{ type: 'message', message: { type: 'response.output_text.delta', delta: 'hi' } }, { type: 'message', message: { type: 'response.completed', response: { status: 'completed' } } }]) yield event; FakeResponsesWS.events = undefined; }
  close(props) { this.closed = props ?? true; }
  on(event, listener) { this.handlers.set(event, listener); return this; }
  off(event) { this.handlers.delete(event); return this; }
}
jest.unstable_mockModule('openai/resources/responses/ws', () => ({ ResponsesWS: FakeResponsesWS }));
const { createOpenAI, createAzureOpenAI } = await import('../src/client.mjs');
afterEach(() => { delete process.env.OPENAI_API_KEY; delete process.env.AZURE_OPENAI_API_KEY; delete process.env.AZURE_OPENAI_ENDPOINT; delete process.env.OPENAI_API_VERSION; FakeResponsesWS.events = undefined; });

describe('createOpenAI', () => {
  test('validates and accepts options', () => { expect(() => createOpenAI()).toThrow('API key'); expect(createOpenAI('test-key').apiKey).toBe('test-key'); process.env.OPENAI_API_KEY = 'env-key'; const client = createOpenAI({ baseURL: 'https://example.test', timeout: 1234, maxRetries: 2 }); expect(client.apiKey).toBe('env-key'); expect(client.baseURL).toBe('https://example.test'); expect(() => createOpenAI(123)).toThrow('options'); expect(() => createOpenAI({ apiKey: '  ' })).toThrow('API key'); });
  test('handles transport selection', () => { expect(createOpenAI({ apiKey: 'key', transport: 'http' }).apiKey).toBe('key'); expect(() => createOpenAI({ apiKey: 'key', transport: 'ftp' })).toThrow('Unsupported transport'); });
  test('creates websocket client with streaming APIs', async () => { const client = createOpenAI({ apiKey: 'key', transport: 'websocket', reconnect: { maxRetries: 1 }, maxQueueSize: 2 }); const stream = []; for await (const event of client.responses.create({ model: 'test', stream: true })) stream.push(event); expect(stream).toHaveLength(2); await expect(client.responses.create({ model: 'test' })).resolves.toMatchObject({ status: 'completed' }); const listener = () => {}; client.responses.on('error', listener).off('error', listener); await client.responses.close(); });
});

describe('createAzureOpenAI', () => {
  test('creates from options and environment', () => { expect(createAzureOpenAI({ apiKey: 'key', endpoint: 'https://azure.test', apiVersion: '2024-10-21', deployment: 'gpt' })).toBeInstanceOf(Object); process.env.AZURE_OPENAI_API_KEY = 'key'; process.env.AZURE_OPENAI_ENDPOINT = 'https://azure.test'; process.env.OPENAI_API_VERSION = '2024-10-21'; expect(createAzureOpenAI()).toBeInstanceOf(Object); });
  test('validates configuration', () => { expect(() => createAzureOpenAI({ apiKey: 'key', apiVersion: 'v' })).toThrow('endpoint'); expect(() => createAzureOpenAI({ apiKey: 'key', endpoint: 'x' })).toThrow('API version'); expect(() => createAzureOpenAI({ endpoint: 'x', apiVersion: 'v' })).toThrow('API key'); });
});

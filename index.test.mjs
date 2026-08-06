import { jest, test, expect, describe, afterEach } from '@jest/globals';

class FakeResponsesWS {
  constructor() { this.handlers = new Map(); this.sent = []; this.closed = false; }
  send(event) { this.sent.push(event); }
  async *stream() {
    for (const event of FakeResponsesWS.events ?? [
      { type: 'message', message: { type: 'response.output_text.delta', delta: 'hi' } },
      { type: 'message', message: { type: 'response.completed', response: { status: 'completed' } } },
    ]) yield event;
    FakeResponsesWS.events = undefined;
  }
  close(props) { this.closed = props ?? true; }
  on(event, listener) { this.handlers.set(event, listener); return this; }
  off(event) { this.handlers.delete(event); return this; }
}
jest.unstable_mockModule('openai/resources/responses/ws', () => ({ ResponsesWS: FakeResponsesWS }));
const { createOpenAI, createAzureOpenAI, ResponsesWebSocketAdapter } = await import('./index.mjs');

afterEach(() => { delete process.env.OPENAI_API_KEY; delete process.env.AZURE_OPENAI_API_KEY; delete process.env.AZURE_OPENAI_ENDPOINT; delete process.env.OPENAI_API_VERSION; });

describe('createOpenAI', () => {
  test('throws if no API key is provided', () => expect(() => createOpenAI()).toThrow('OpenAI API key is required'));
  test('returns client with provided API key', () => expect(createOpenAI('test-key').apiKey).toBe('test-key'));
  test('accepts full SDK options and environment key', () => { process.env.OPENAI_API_KEY = 'env-key'; const client = createOpenAI({ baseURL: 'https://example.test', timeout: 1234, maxRetries: 2 }); expect(client.apiKey).toBe('env-key'); expect(client.baseURL).toBe('https://example.test'); });
  test('validates options and blank keys', () => { expect(() => createOpenAI(123)).toThrow('options'); expect(() => createOpenAI({ apiKey: '  ' })).toThrow('API key'); expect(() => createOpenAI({ apiKey: 'key', organization: 'org', project: 'proj' })).not.toThrow(); });
  test('rejects unsupported transports', () => expect(() => createOpenAI({ apiKey: 'key', transport: 'ftp' })).toThrow('Unsupported transport'));
  test('accepts HTTP transport explicitly', () => expect(createOpenAI({ apiKey: 'key', transport: 'http' }).apiKey).toBe('key'));
  test('supports websocket streaming and non-streaming responses', async () => {
    const client = createOpenAI({ apiKey: 'key', transport: 'websocket', reconnect: { maxRetries: 1 }, maxQueueSize: 2 });
    const stream = client.responses.create({ model: 'test', input: 'hi', stream: true });
    const events = []; for await (const event of stream) events.push(event); expect(events).toHaveLength(2);
    const response = await client.responses.create({ model: 'test', input: 'hi' });
    expect(response.status).toBe('completed');
    const streamed = []; for await (const event of client.responses.stream({ model: 'test', input: 'hi' })) streamed.push(event); expect(streamed).toHaveLength(2);
    const streamedWithOptions = []; for await (const event of client.responses.stream({ model: 'test' }, { timeout: 1 })) streamedWithOptions.push(event); expect(streamedWithOptions).toHaveLength(2);
    const listener = () => {}; client.responses.on('error', listener).off('error', listener); client.responses.close({ code: 1000 });
  });
  test('supports direct adapter construction with default options', () => expect(new ResponsesWebSocketAdapter({}).socket).toBeInstanceOf(FakeResponsesWS));
  test('supports adapter default create input', async () => { const adapter = new ResponsesWebSocketAdapter({}); expect((await adapter.create()).status).toBe('completed'); });
  test('supports adapter stream helper directly', async () => { const adapter = new ResponsesWebSocketAdapter({}); const events = []; for await (const event of adapter.stream({ model: 'test' })) events.push(event); expect(events).toHaveLength(2); const defaults = []; for await (const event of adapter.stream()) defaults.push(event); expect(defaults).toHaveLength(2); });
  test('delegates non-create Responses helpers over HTTP', async () => {
    const calls = {}; const http = {};
    for (const name of ['retrieve', 'delete', 'cancel', 'parse']) http[name] = (...args) => { calls[name] = args; return Promise.resolve(name); };
    const adapter = new ResponsesWebSocketAdapter({}, {}, http);
    await expect(adapter.retrieve('id')).resolves.toBe('retrieve');
    await expect(adapter.delete('id')).resolves.toBe('delete');
    await expect(adapter.cancel('id')).resolves.toBe('cancel');
    await expect(adapter.parse({})).resolves.toBe('parse');
    expect(Object.keys(calls)).toEqual(['retrieve', 'delete', 'cancel', 'parse']);
  });
  test('handles websocket error and close events', async () => {
    const client = createOpenAI({ apiKey: 'key', transport: 'websocket' });
    FakeResponsesWS.events = [{ type: 'error', error: new Error('socket') }];
    await expect(client.responses.create({ model: 'test' })).rejects.toThrow('socket');
    FakeResponsesWS.events = [{ type: 'close' }];
    const events = []; for await (const event of client.responses.create({ model: 'test', stream: true })) events.push(event);
    expect(events).toEqual([]); client.responses.close();
  });
});

describe('createAzureOpenAI', () => {
  test('creates an Azure client from options', () => expect(createAzureOpenAI({ apiKey: 'key', endpoint: 'https://azure.test', apiVersion: '2024-10-21', deployment: 'gpt' })).toBeInstanceOf(Object));
  test('uses environment configuration', () => { process.env.AZURE_OPENAI_API_KEY = 'key'; process.env.AZURE_OPENAI_ENDPOINT = 'https://azure.test'; process.env.OPENAI_API_VERSION = '2024-10-21'; expect(createAzureOpenAI()).toBeInstanceOf(Object); });
  test('validates Azure configuration', () => { expect(() => createAzureOpenAI({ apiKey: 'key', apiVersion: 'v' })).toThrow('endpoint'); expect(() => createAzureOpenAI({ apiKey: 'key', endpoint: 'x' })).toThrow('API version'); expect(() => createAzureOpenAI({ endpoint: 'x', apiVersion: 'v' })).toThrow('API key'); });
});

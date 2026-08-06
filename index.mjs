import OpenAI, { AzureOpenAI } from 'openai';
import { ResponsesWS } from 'openai/resources/responses/ws';

function normalizeOptions(options) {
  if (typeof options === 'string') return { apiKey: options };
  if (options === undefined) return {};
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('OpenAI options must be an object or API key string.');
  return { ...options };
}
function requireApiKey(apiKey) { if (typeof apiKey !== 'string' || !apiKey.trim()) throw new Error('OpenAI API key is required'); }

export class ResponsesWebSocketAdapter {
  constructor(client, options = {}, httpResponses = client.responses) {
    this.socket = new ResponsesWS(client, options);
    this.httpResponses = httpResponses;
    this.inputItems = httpResponses?.inputItems;
    this.inputTokens = httpResponses?.inputTokens;
  }
  create(input = {}) {
    const { stream = false, ...response } = input;
    const iterator = this._request(response);
    if (stream) return iterator;
    return (async () => {
      let completed;
      for await (const event of iterator) {
        if (event.type === 'response.completed') completed = event.response;
      }
      return completed;
    })();
  }
  async *_request(response) {
    const events = this.socket.stream();
    this.socket.send({ type: 'response.create', ...response });
    for await (const event of events) {
      if (event.type === 'message') {
        yield event.message;
        if (event.message?.type === 'response.completed' || event.message?.type === 'response.failed' || event.message?.type === 'response.incomplete') return;
      } else if (event.type === 'error') throw event.error;
    }
  }
  stream(input = {}, options) { const params = { ...input, ...options, stream: true }; return this.create(params); }
  retrieve(...args) { return this.httpResponses.retrieve(...args); }
  delete(...args) { return this.httpResponses.delete(...args); }
  cancel(...args) { return this.httpResponses.cancel(...args); }
  parse(...args) { return this.httpResponses.parse(...args); }
  close(props) { return this.socket.close(props); }
  on(...args) { this.socket.on(...args); return this; }
  off(...args) { this.socket.off(...args); return this; }
}

function createClient(Client, options, env) {
  const config = normalizeOptions(options);
  const apiKey = config.apiKey ?? process.env[env];
  requireApiKey(apiKey);
  const transport = config.transport ?? 'http';
  const { transport: _, reconnect, maxQueueSize, ...sdkOptions } = config;
  const client = new Client({ ...sdkOptions, apiKey });
  if (transport === 'http') return client;
  if (transport !== 'websocket' && transport !== 'responses-ws') throw new Error(`Unsupported transport: ${transport}`);
  client.responses = new ResponsesWebSocketAdapter(client, { reconnect, maxQueueSize }, client.responses);
  return client;
}

/** Creates an OpenAI client. Supports HTTP (default) and Responses WebSocket transports. */
export function createOpenAI(options) { return createClient(OpenAI, options, 'OPENAI_API_KEY'); }
/** Creates an Azure OpenAI client from SDK options or environment variables. */
export function createAzureOpenAI(options = {}) {
  const config = normalizeOptions(options);
  const apiKey = config.apiKey ?? process.env.AZURE_OPENAI_API_KEY;
  const endpoint = config.endpoint ?? process.env.AZURE_OPENAI_ENDPOINT;
  const apiVersion = config.apiVersion ?? process.env.OPENAI_API_VERSION;
  requireApiKey(apiKey);
  if (typeof endpoint !== 'string' || !endpoint.trim()) throw new Error('Azure OpenAI endpoint is required');
  if (typeof apiVersion !== 'string' || !apiVersion.trim()) throw new Error('Azure OpenAI API version is required');
  return createClient(AzureOpenAI, config, 'AZURE_OPENAI_API_KEY');
}

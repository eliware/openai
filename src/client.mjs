import OpenAI from 'openai';
import { normalizeOptions, requireApiKey } from './options.mjs';
import { ResponsesWebSocketAdapter } from './responses-websocket/index.mjs';
import { createHTTPResponsesAdapter } from './responses-http/index.mjs';
function createClient(Client, options, env) { const config = normalizeOptions(options); const apiKey = config.apiKey ?? process.env[env]; requireApiKey(apiKey); const transport = config.transport ?? 'http'; const { transport: _, maxQueueSize, WebSocketImpl, url, ...sdkOptions } = config; const client = new Client({ ...sdkOptions, apiKey }); if (transport === 'http') { client.responses = createHTTPResponsesAdapter(client.responses); return client; } if (transport !== 'websocket') throw new Error(`Unsupported transport: ${transport}`); client.responses = new ResponsesWebSocketAdapter(client, { maxQueueSize, WebSocketImpl, url }, client.responses); return client; }
export function createOpenAI(options) { return createClient(OpenAI, options, 'OPENAI_API_KEY'); }

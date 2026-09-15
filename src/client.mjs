import OpenAI from 'openai';
import { resolveClientConfiguration } from './client/configuration.mjs';
import { attachTransport } from './client/transport.mjs';
function createClient(Client, options, env) { const { config, apiKey } = resolveClientConfiguration(options, env); const { transport: _, maxQueueSize, WebSocketImpl, url, ...sdkOptions } = config; const client = new Client({ ...sdkOptions, apiKey }); return attachTransport(client, { ...config, maxQueueSize, WebSocketImpl, url }); }
export function createOpenAI(options) { return createClient(OpenAI, options, 'OPENAI_API_KEY'); }

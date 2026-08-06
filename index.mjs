import OpenAI, { AzureOpenAI } from 'openai';

function normalizeOptions(options) {
  if (typeof options === 'string') return { apiKey: options };
  if (options === undefined) return {};
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('OpenAI options must be an object or API key string.');
  return { ...options };
}

function requireApiKey(apiKey) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) throw new Error('OpenAI API key is required');
}

/** Creates an OpenAI client. Accepts an API key string or full SDK options. */
export function createOpenAI(options) {
  const config = normalizeOptions(options);
  const apiKey = config.apiKey ?? process.env.OPENAI_API_KEY;
  requireApiKey(apiKey);
  return new OpenAI({ ...config, apiKey });
}

/** Creates an Azure OpenAI client from SDK options or environment variables. */
export function createAzureOpenAI(options = {}) {
  const config = normalizeOptions(options);
  const apiKey = config.apiKey ?? process.env.AZURE_OPENAI_API_KEY;
  const endpoint = config.endpoint ?? process.env.AZURE_OPENAI_ENDPOINT;
  const apiVersion = config.apiVersion ?? process.env.OPENAI_API_VERSION;
  requireApiKey(apiKey);
  if (typeof endpoint !== 'string' || !endpoint.trim()) throw new Error('Azure OpenAI endpoint is required');
  if (typeof apiVersion !== 'string' || !apiVersion.trim()) throw new Error('Azure OpenAI API version is required');
  return new AzureOpenAI({ ...config, apiKey, endpoint, apiVersion });
}

export function normalizeOptions(options) {
  if (typeof options === 'string') return { apiKey: options };
  if (options === undefined) return {};
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('OpenAI options must be an object or API key string.');
  return { ...options };
}
export function requireApiKey(apiKey) { if (typeof apiKey !== 'string' || !apiKey.trim()) throw new Error('OpenAI API key is required'); }

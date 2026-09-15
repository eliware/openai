export function requireApiKey(apiKey) { if (typeof apiKey !== 'string' || !apiKey.trim()) throw new Error('OpenAI API key is required'); }

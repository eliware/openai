import { normalizeOptions } from '../options/normalize.mjs';
import { requireApiKey } from '../options/api-key.mjs';

export function resolveClientConfiguration(options, env) {
  const config = normalizeOptions(options);
  const apiKey = config.apiKey ?? process.env[env];
  requireApiKey(apiKey);
  return { config, apiKey };
}

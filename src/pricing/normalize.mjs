import { validateUsage } from "./usage/validation.mjs";

export function normalizeUsage(usage = {}) {
  validateUsage(usage);
  return {
    input: usage.input_tokens ?? 0,
    cachedInput: usage.input_tokens_details?.cached_tokens ?? 0,
    cacheWrite: usage.input_tokens_details?.cache_write_tokens ?? 0,
    output: usage.output_tokens ?? 0,
  };
}

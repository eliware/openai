import { validateUsageConsistency } from "./consistency.mjs";
import { validateUsageCount } from "./count.mjs";

export function validateUsage(usage = {}) {
  if (!usage || typeof usage !== "object") {
    const error = new Error("Usage must be an object");
    error.code = "INVALID_USAGE";
    throw error;
  }
  const input = validateUsageCount(usage, "input_tokens");
  const cachedInput = validateUsageCount(usage.input_tokens_details, "cached_tokens");
  const cacheWrite = validateUsageCount(usage.input_tokens_details, "cache_write_tokens");
  validateUsageCount(usage, "output_tokens");
  validateUsageConsistency(input, cachedInput, cacheWrite);
}

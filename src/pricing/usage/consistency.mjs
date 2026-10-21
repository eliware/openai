export function validateUsageConsistency(input, cachedInput, cacheWrite) {
  if (cachedInput + cacheWrite > input) {
    const error = new Error("Cached usage must be no more than input usage");
    error.code = "INVALID_USAGE";
    throw error;
  }
}

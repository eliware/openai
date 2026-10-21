export function validateUsageCount(usage, key) {
  const value = usage?.[key] ?? 0;
  if (!Number.isInteger(value) || value < 0) {
    const error = new Error(`Invalid usage field: ${key}`);
    error.code = "INVALID_USAGE";
    throw error;
  }
  return value;
}

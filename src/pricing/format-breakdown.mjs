export function formatBreakdown(model, normalized, longContext, costs) {
  const round = value => Number(value.toFixed(6));
  return {
    model,
    input_tokens: normalized.input,
    cached_tokens: normalized.cachedInput,
    cache_write_tokens: normalized.cacheWrite,
    output_tokens: normalized.output,
    long_context: longContext,
    uncached_input_cost_usd: round(costs.uncached),
    cached_input_cost_usd: round(costs.cached),
    cache_write_cost_usd: round(costs.cacheWrite),
    output_cost_usd: round(costs.output),
    estimated_cost_usd: round(costs.total),
  };
}

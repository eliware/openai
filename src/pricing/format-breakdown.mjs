import { roundCost } from "./formatting/round-cost.mjs";

export function formatBreakdown(model, normalized, longContext, costs) {
  return {
    model,
    input_tokens: normalized.input,
    cached_tokens: normalized.cachedInput,
    cache_write_tokens: normalized.cacheWrite,
    output_tokens: normalized.output,
    long_context: longContext,
    uncached_input_cost_usd: roundCost(costs.uncached),
    cached_input_cost_usd: roundCost(costs.cached),
    cache_write_cost_usd: roundCost(costs.cacheWrite),
    output_cost_usd: roundCost(costs.output),
    estimated_cost_usd: roundCost(costs.total),
  };
}

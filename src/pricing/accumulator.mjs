import { calculateUsageCostBreakdown } from './calculator.mjs';

export function createPricingAccumulator() {
  const totals = new Map();
  let requests = 0;

  return {
    add(model, usage) {
      const breakdown = calculateUsageCostBreakdown(model, usage);
      const current = totals.get(model) ?? { requests: 0, input_tokens: 0, cached_tokens: 0, cache_write_tokens: 0, output_tokens: 0, estimated_cost_usd: 0 };
      current.requests += 1;
      current.input_tokens += breakdown.input_tokens;
      current.cached_tokens += breakdown.cached_tokens;
      current.cache_write_tokens += breakdown.cache_write_tokens;
      current.output_tokens += breakdown.output_tokens;
      current.estimated_cost_usd = Number((current.estimated_cost_usd + breakdown.estimated_cost_usd).toFixed(6));
      totals.set(model, current);
      requests += 1;
      return this;
    },
    summary() {
      const models = Object.fromEntries([...totals].map(([model, value]) => [model, { ...value }]));
      const total = Object.values(models).reduce((sum, value) => sum + value.estimated_cost_usd, 0);
      return { requests, estimated_cost_usd: Number(total.toFixed(6)), models };
    },
  };
}

import { getPricing } from './catalog.mjs';
import { LONG_CONTEXT_INPUT_MULTIPLIERS, LONG_CONTEXT_INPUT_THRESHOLD } from './policy.mjs';
import { normalizeUsage } from './normalize.mjs';
import { computeCosts } from './compute-costs.mjs';
import { formatBreakdown } from './format-breakdown.mjs';

export function calculateUsageCostBreakdown(model, usage) {
  const rates = getPricing(model);
  const normalized = normalizeUsage(usage);
  const longContext = normalized.input > LONG_CONTEXT_INPUT_THRESHOLD;
  const costs = computeCosts(normalized, rates, longContext, LONG_CONTEXT_INPUT_MULTIPLIERS);
  return formatBreakdown(model, normalized, longContext, costs);
}

export function calculateUsageCost(model, usage) {
  return calculateUsageCostBreakdown(model, usage).estimated_cost_usd;
}

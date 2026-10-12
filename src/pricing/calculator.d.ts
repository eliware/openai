import type { PricedModel } from "./catalog.mjs";
import type { ResponsesUsage } from "./normalize.mjs";

export interface PricingBreakdown {
  model: PricedModel;
  input_tokens: number;
  cached_tokens: number;
  cache_write_tokens: number;
  output_tokens: number;
  long_context: boolean;
  uncached_input_cost_usd: number;
  cached_input_cost_usd: number;
  cache_write_cost_usd: number;
  output_cost_usd: number;
  estimated_cost_usd: number;
}

export declare function calculateUsageCost(
  model: PricedModel,
  usage?: ResponsesUsage | null,
): number;
export declare function calculateUsageCostBreakdown(
  model: PricedModel,
  usage?: ResponsesUsage | null,
): PricingBreakdown;

import type { PricingBreakdown } from "./calculator.mjs";
import type { PricedModel } from "./catalog.mjs";
import type { ResponsesUsage } from "./normalize.mjs";

export interface PricingAccumulator {
  add(model: PricedModel, usage?: ResponsesUsage | null): this;
  summary(): {
    requests: number;
    estimated_cost_usd: number;
    models: Partial<
      Record<
        PricedModel,
        Omit<
          PricingBreakdown,
          | "model"
          | "long_context"
          | "uncached_input_cost_usd"
          | "cached_input_cost_usd"
          | "cache_write_cost_usd"
          | "output_cost_usd"
        >
      >
    >;
  };
}

export declare function createPricingAccumulator(): PricingAccumulator;

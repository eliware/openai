import { roundCost } from "./formatting/round-cost.mjs";

export function formatPricingSummary(requests, totals) {
  const models = Object.fromEntries(
    [...totals].map(([model, value]) => [
      model,
      { ...value, estimated_cost_usd: roundCost(value.estimated_cost_usd) },
    ]),
  );
  const total = [...totals.values()].reduce((sum, value) => sum + value.estimated_cost_usd, 0);
  return { requests, estimated_cost_usd: roundCost(total), models };
}

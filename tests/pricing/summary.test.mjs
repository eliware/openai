import { formatPricingSummary } from "../../src/pricing/summary.mjs";

test("formats per-model totals and the overall request summary", () => {
  const totals = new Map([
    ["gpt-6-sol", { requests: 1, estimated_cost_usd: 1.234567 }],
    ["gpt-6-luna", { requests: 2, estimated_cost_usd: 0.765432 }],
  ]);

  expect(formatPricingSummary(3, totals)).toEqual({
    requests: 3,
    estimated_cost_usd: 1.999999,
    models: {
      "gpt-6-sol": { requests: 1, estimated_cost_usd: 1.234567 },
      "gpt-6-luna": { requests: 2, estimated_cost_usd: 0.765432 },
    },
  });
});

test("returns a fresh model summary without changing stored totals", () => {
  const totals = new Map([["gpt-6-sol", { requests: 1, estimated_cost_usd: 1 }]]);

  const summary = formatPricingSummary(1, totals);
  summary.models["gpt-6-sol"].requests = 5;

  expect(totals.get("gpt-6-sol").requests).toBe(1);
});

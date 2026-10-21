import { formatBreakdown, roundCost } from "../../src/pricing/format-breakdown.mjs";
test("formats pricing breakdown", () => {
  const result = formatBreakdown(
    "m",
    { input: 1, cachedInput: 2, cacheWrite: 3, output: 4 },
    false,
    { uncached: 1.2345678, cached: 0, cacheWrite: 0, output: 0, total: 1.2345678 },
  );
  expect(result.model).toBe("m");
  expect(result.uncached_input_cost_usd).toBe(1.234568);
});

test("rounds cost values to six decimal places", () => {
  expect(roundCost(1.2345678)).toBe(1.234568);
});

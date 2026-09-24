import { calculateUsageCost, calculateUsageCostBreakdown } from '../../src/pricing/calculator.mjs';
test('calculates a detailed cost', () => { const usage = { input_tokens: 10, output_tokens: 2 }; expect(calculateUsageCost('gpt-5.6-luna', usage)).toBe(0.000004); expect(calculateUsageCostBreakdown('gpt-5.6-luna', usage).estimated_cost_usd).toBe(0.000004); });
test('applies long-context pricing', () => { const result = calculateUsageCostBreakdown('gpt-5.6-luna', { input_tokens: 300000, output_tokens: 1 }); expect(result.long_context).toBe(true); expect(result.estimated_cost_usd).toBeGreaterThan(0); });
test.each([
  ['gpt-6-astra', 10, 1, 50],
  ['gpt-6-sol', 2, 0.2, 10],
  ['gpt-6-luna', 0.1, 0.01, 0.5],
])('calculates standard and long-context cost for %s', (model, inputRate, cachedRate, outputRate) => {
  const usage = { input_tokens: 300_000, input_tokens_details: { cached_tokens: 100_000, cache_write_tokens: 20_000 }, output_tokens: 1_000_000 };
  const breakdown = calculateUsageCostBreakdown(model, usage);
  expect(breakdown).toMatchObject({ model, long_context: true, cached_input_cost_usd: 2 * cachedRate * 100_000 / 1_000_000, output_cost_usd: outputRate * 1.5 });
  expect(breakdown.uncached_input_cost_usd).toBeCloseTo((300_000 - 100_000 - 20_000) * inputRate * 2 / 1_000_000, 6);
});

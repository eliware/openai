import { normalizeUsage } from '../../src/pricing/normalize.mjs';
test('normalizes Responses usage', () => { expect(normalizeUsage({ input_tokens: 2, input_tokens_details: { cached_tokens: 1, cache_write_tokens: 0 }, output_tokens: 3 })).toEqual({ input: 2, cachedInput: 1, cacheWrite: 0, output: 3 }); });
test('normalizes omitted fields to zero', () => { expect(normalizeUsage()).toEqual({ input: 0, cachedInput: 0, cacheWrite: 0, output: 0 }); });
test('rejects invalid and contradictory usage', () => {
  expect(() => normalizeUsage(null)).toThrow('Usage must be an object');
  expect(() => normalizeUsage({ input_tokens: -1 })).toThrow('input_tokens');
  expect(() => normalizeUsage({ output_tokens: 1.5 })).toThrow('output_tokens');
  expect(() => normalizeUsage({ input_tokens: 1, input_tokens_details: { cached_tokens: 1, cache_write_tokens: 1 } })).toThrow('exceed');
});

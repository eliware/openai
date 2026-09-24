import { API_PRICING, getPricing } from '../../src/pricing/catalog.mjs';
test('catalog exposes current GPT-6 and GPT-5.6 models', () => {
  expect(Object.keys(API_PRICING)).toEqual(['gpt-6-astra', 'gpt-6-sol', 'gpt-6-luna', 'gpt-5.6-luna', 'gpt-5.6-terra', 'gpt-5.6-sol']);
  expect(getPricing('gpt-6-astra')).toEqual({ input: 10, cachedInput: 1, output: 50, cacheWriteMultiplier: 1.25 });
  expect(getPricing('gpt-6-sol')).toEqual({ input: 2, cachedInput: 0.2, output: 10, cacheWriteMultiplier: 1.25 });
  expect(getPricing('gpt-6-luna')).toEqual({ input: 0.1, cachedInput: 0.01, output: 0.5, cacheWriteMultiplier: 1.25 });
  expect(getPricing('gpt-5.6-luna').input).toBe(0.2);
});
test('rejects unknown pricing models', () => { expect(() => getPricing('unknown')).toThrow('Unknown pricing model'); });

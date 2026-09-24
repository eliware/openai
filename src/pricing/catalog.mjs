// Standard API text-token rates, in USD per 1M tokens. Service-tier premiums,
// hosted-tool call fees, batch discounts, and modality-specific fees are not
// represented by this catalog.
export const API_PRICING = Object.freeze({
  'gpt-6-astra': Object.freeze({ input: 10, cachedInput: 1, output: 50, cacheWriteMultiplier: 1.25 }),
  'gpt-6-sol': Object.freeze({ input: 2, cachedInput: 0.2, output: 10, cacheWriteMultiplier: 1.25 }),
  'gpt-6-luna': Object.freeze({ input: 0.1, cachedInput: 0.01, output: 0.5, cacheWriteMultiplier: 1.25 }),
  'gpt-5.6-luna': Object.freeze({ input: 0.2, cachedInput: 0.02, output: 1.2, cacheWriteMultiplier: 1.25 }),
  'gpt-5.6-terra': Object.freeze({ input: 2, cachedInput: 0.2, output: 12, cacheWriteMultiplier: 1.25 }),
  'gpt-5.6-sol': Object.freeze({ input: 4, cachedInput: 0.4, output: 20, cacheWriteMultiplier: 1.25 }),
});

export function getPricing(model) {
  const rates = API_PRICING[model];
  if (!rates) throw new Error(`Unknown pricing model: ${model}`);
  return rates;
}

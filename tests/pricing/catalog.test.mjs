import { API_PRICING, getPricing } from '../../src/pricing/catalog.mjs';
test('catalog exposes all supported GPT-5.6 models', () => { expect(Object.keys(API_PRICING)).toEqual(['gpt-5.6-luna', 'gpt-5.6-terra', 'gpt-5.6-sol']); expect(getPricing('gpt-5.6-luna').input).toBe(0.2); });
test('rejects unknown pricing models', () => { expect(() => getPricing('unknown')).toThrow('Unknown pricing model'); });

import { createPricingAccumulator } from '../../src/pricing/accumulator.mjs';
test('aggregates requests by model', () => { const accumulator = createPricingAccumulator(); accumulator.add('gpt-5.6-luna', { input_tokens: 10, output_tokens: 2 }); expect(accumulator.summary()).toMatchObject({ requests: 1, estimated_cost_usd: 0.000004, models: { 'gpt-5.6-luna': { requests: 1 } } }); });

import { createPricingAccumulator } from "../../src/pricing/accumulator.mjs";
test("aggregates requests by model", () => {
  const accumulator = createPricingAccumulator();
  accumulator.add("gpt-5.6-luna", { input_tokens: 10, output_tokens: 2 });
  expect(accumulator.summary()).toMatchObject({
    requests: 1,
    estimated_cost_usd: 0.000004,
    models: { "gpt-5.6-luna": { requests: 1 } },
  });
});
test("aggregates GPT-6 usage under GPT-6 model IDs", () => {
  const accumulator = createPricingAccumulator();
  accumulator.add("gpt-6-sol", { input_tokens: 1_000_000, output_tokens: 1_000_000 });
  expect(accumulator.summary()).toMatchObject({
    models: { "gpt-6-sol": { requests: 1, estimated_cost_usd: 19 } },
  });
});

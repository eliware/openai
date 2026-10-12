import { API_PRICING, calculateUsageCost, createOpenAI, getPricing } from "../src/index.mjs";

test("public entrypoint exports client and pricing APIs", () => {
  expect(typeof createOpenAI).toBe("function");
  expect(typeof calculateUsageCost).toBe("function");
  expect(getPricing("gpt-6.1-sol")).toBe(API_PRICING["gpt-6.1-sol"]);
});

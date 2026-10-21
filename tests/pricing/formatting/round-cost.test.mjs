import { roundCost } from "../../../src/pricing/formatting/round-cost.mjs";

test("rounds cost values to six decimal places", () => {
  expect(roundCost(1.2345678)).toBe(1.234568);
});

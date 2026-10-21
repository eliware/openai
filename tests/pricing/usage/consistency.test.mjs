import { validateUsageConsistency } from "../../../src/pricing/usage/consistency.mjs";

test("rejects cached and cache-write counts above input usage", () => {
  expect(() => validateUsageConsistency(1, 1, 1)).toThrow(
    "Cached usage must be no more than input usage",
  );
});

test("accepts cached and cache-write counts within input usage", () => {
  expect(() => validateUsageConsistency(3, 1, 2)).not.toThrow();
});

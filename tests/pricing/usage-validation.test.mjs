import { validateUsage } from "../../src/pricing/usage-validation.mjs";

test.each([-1, 1.5])("rejects invalid usage count %p", (input_tokens) => {
  expect(() => validateUsage({ input_tokens })).toThrow();
});

test("rejects a non-object usage value", () => {
  expect(() => validateUsage(null)).toThrow("Usage must be an object");
});

test("rejects cached and cache-write counts above input usage", () => {
  expect(() =>
    validateUsage({
      input_tokens: 1,
      input_tokens_details: { cached_tokens: 1, cache_write_tokens: 1 },
    }),
  ).toThrow("no more than");
});

test("accepts omitted counts and consistent usage", () => {
  expect(() => validateUsage()).not.toThrow();
  expect(() =>
    validateUsage({
      input_tokens: 3,
      input_tokens_details: { cached_tokens: 1, cache_write_tokens: 2 },
      output_tokens: 4,
    }),
  ).not.toThrow();
});

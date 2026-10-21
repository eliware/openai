import { validateUsageCount } from "../../../src/pricing/usage/count.mjs";

test.each([-1, 1.5])("rejects invalid usage count %p", (input_tokens) => {
  expect(() => validateUsageCount({ input_tokens }, "input_tokens")).toThrow(
    "Invalid usage field: input_tokens",
  );
});

test("treats an omitted usage count as zero", () => {
  expect(validateUsageCount({}, "input_tokens")).toBe(0);
});

import { validateSignal } from "../../../src/responses-http/validate/signal.mjs";
test("validates abort signals", () => {
  expect(() => validateSignal({})).toThrow("signal must be an AbortSignal");
  expect(() => validateSignal()).not.toThrow();
});
test("accepts omitted signals and valid AbortSignals", () => {
  expect(() => validateSignal(undefined)).not.toThrow();
  expect(() => validateSignal(new AbortController().signal)).not.toThrow();
});

import { validateCallbackOptions } from "../../../src/responses-http/callback/validate-options.mjs";

test("accepts callback functions and an abort signal", () => {
  const options = {
    signal: new AbortController().signal,
    onEvent: () => {},
  };
  expect(() => validateCallbackOptions(options)).not.toThrow();
});

test("rejects invalid callback values", () => {
  expect(() => validateCallbackOptions({ onEvent: true })).toThrow("onEvent must be a function");
});

test("rejects invalid signals", () => {
  expect(() => validateCallbackOptions({ signal: {} })).toThrow("signal must be an AbortSignal");
});

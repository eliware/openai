import { HANDLER_KEYS, splitOptions } from "../../src/responses-http/callback-options.mjs";

test("isolates callback options from request options", () => {
  const onEvent = () => {};
  const result = splitOptions({ model: "gpt-5.6", onEvent });
  expect(HANDLER_KEYS).toContain("onEvent");
  expect(result.handlers.onEvent).toBe(onEvent);
  expect(result.requestOptions).toEqual({ model: "gpt-5.6" });
});
test("retains an AbortSignal in options while recognizing its handler key", () => {
  const signal = new AbortController().signal;
  const result = splitOptions({ signal, timeout: 5 });
  expect(result.handlers.signal).toBe(signal);
  expect(result.requestOptions).toEqual({ signal, timeout: 5 });
});
test("normalizes null options to empty handler and request option objects", () => {
  expect(splitOptions(null)).toEqual({ handlers: {}, requestOptions: {} });
});

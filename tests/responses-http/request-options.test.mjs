import { splitRequest } from "../../src/responses-http/request-options.mjs";

test("splits HTTP request payload, options, and handlers", () => {
  const onEvent = () => {};
  const onError = () => {};
  const result = splitRequest(
    { model: "gpt-5.6", stream: true, onEvent, onError },
    { signal: undefined },
  );
  expect(result.request).toEqual({ model: "gpt-5.6", stream: true });
  expect(result.handlers.onEvent).toBe(onEvent);
  expect(result.handlers.onError).toBe(onError);
  expect(result.streaming).toBe(true);
});
test("merges callback sources with options precedence and resolves streaming", () => {
  const fromInput = () => {};
  const fromOptions = () => {};
  const result = splitRequest(
    { model: "gpt-6-luna", onEvent: fromInput },
    { stream: false, onEvent: fromOptions, signal: new AbortController().signal, timeout: 10 },
  );
  expect(result.request).toEqual({ model: "gpt-6-luna", stream: false });
  expect(result.streaming).toBe(false);
  expect(result.handlers.onEvent).toBe(fromOptions);
  expect(result.requestOptions).toMatchObject({ timeout: 10 });
  expect(result.requestOptions.signal).toBeInstanceOf(AbortSignal);
});
test("omits stream when neither request source specifies it", () => {
  const result = splitRequest({ model: "gpt-6-luna" }, {});
  expect(result.request).toEqual({ model: "gpt-6-luna" });
  expect(result.streaming).toBeUndefined();
});

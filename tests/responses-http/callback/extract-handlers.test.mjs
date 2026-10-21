import { extractHandlers } from "../../../src/responses-http/callback/extract-handlers.mjs";

test("moves handlers out of request options and keeps the signal", () => {
  const onEvent = () => {};
  const signal = new AbortController().signal;
  const requestOptions = { model: "gpt-5.6", onEvent, signal };

  expect(extractHandlers(requestOptions)).toEqual({ onEvent, signal });
  expect(requestOptions).toEqual({ model: "gpt-5.6", signal });
});

test("returns no handlers when request options contain none", () => {
  const requestOptions = { model: "gpt-5.6" };

  expect(extractHandlers(requestOptions)).toEqual({});
  expect(requestOptions).toEqual({ model: "gpt-5.6" });
});

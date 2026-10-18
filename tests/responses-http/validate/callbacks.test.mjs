import { validateCallbacks } from "../../../src/responses-http/validate/callbacks.mjs";
test("validates callback values", () => {
  expect(() => validateCallbacks({ onEvent: 1 }, ["onEvent"])).toThrow(
    "onEvent must be a function",
  );
  expect(() => validateCallbacks({ onEvent() {} }, ["onEvent"])).not.toThrow();
});
test("validates every supported callback key and ignores absent handlers", () => {
  expect(() =>
    validateCallbacks({ onError: true, onCompleted: 3 }, ["onError", "onCompleted"]),
  ).toThrow("onError must be a function");
  expect(() => validateCallbacks({}, ["onError", "onCompleted"])).not.toThrow();
});

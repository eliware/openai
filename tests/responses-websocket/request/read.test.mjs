import { jest } from "@jest/globals";
import { readRequestEvent } from "../../../src/responses-websocket/request/read.mjs";

test("reads transport events", async () => {
  await expect(
    readRequestEvent(
      async () => ({ value: 1, done: false }),
      {},
      () => false,
    ),
  ).resolves.toEqual({ value: 1, done: false });
});
test("reports aborts and preserves ResponsesError failures", async () => {
  const onError = jest.fn();
  const abort = new Error("aborted");
  await expect(
    readRequestEvent(
      async () => {
        throw abort;
      },
      { onError },
      () => true,
    ),
  ).rejects.toBe(abort);
  const responseError = new (
    await import("../../../src/errors/responses-error.mjs")
  ).ResponsesError("known");
  await expect(
    readRequestEvent(
      async () => {
        throw responseError;
      },
      { onError },
      () => false,
      { aborted: false },
    ),
  ).rejects.toBe(responseError);
});
test.each([
  [new Error("transport"), "transport"],
  [null, "Responses WebSocket request failed"],
])("normalizes transport failure %p", async (error, message) => {
  const onError = jest.fn();
  await expect(
    readRequestEvent(
      async () => {
        throw error;
      },
      { onError },
      () => false,
    ),
  ).rejects.toThrow(message);
  expect(onError).toHaveBeenCalled();
});
test("handles an explicit non-aborted signal", async () => {
  await expect(
    readRequestEvent(
      async () => {
        throw new Error("transport");
      },
      {},
      () => false,
      { aborted: false },
    ),
  ).rejects.toThrow("transport");
});

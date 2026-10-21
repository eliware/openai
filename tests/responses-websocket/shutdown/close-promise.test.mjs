import { reuseClosePromise } from "../../../src/responses-websocket/shutdown/close-promise.mjs";

test("reuses an active close promise and skips a closed adapter", async () => {
  const adapter = {};
  let starts = 0;
  const startClose = () => {
    starts += 1;
    return Promise.resolve();
  };
  const first = reuseClosePromise(adapter, startClose);
  expect(reuseClosePromise(adapter, startClose)).toBe(first);
  await first;
  expect(starts).toBe(1);
  adapter._closed = true;
  await expect(reuseClosePromise(adapter, startClose)).resolves.toBeUndefined();
});

test("clears a rejected close promise so a later close can retry", async () => {
  const adapter = {};
  const failure = Promise.reject(new Error("close failed"));
  const close = reuseClosePromise(adapter, () => failure);
  await expect(close).rejects.toThrow("close failed");
  await Promise.resolve();
  expect(adapter._closePromise).toBeNull();
});

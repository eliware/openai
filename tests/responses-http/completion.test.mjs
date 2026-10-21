import { jest } from "@jest/globals";
import { completeHTTP } from "../../src/responses-http/completion.mjs";

test("wraps request failures and reports an error event", async () => {
  const onError = jest.fn();
  const error = Object.assign(new Error("bad request"), {
    status: 429,
    code: "rate_limit",
    requestID: "req",
  });
  await expect(completeHTTP(Promise.reject(error), { onError })).rejects.toMatchObject({
    name: "ResponsesError",
    status: 429,
    code: "rate_limit",
    requestId: "req",
    cause: error,
  });
  expect(onError).toHaveBeenCalledWith(
    expect.any(Error),
    expect.objectContaining({ type: "error", requestId: "req" }),
  );
});

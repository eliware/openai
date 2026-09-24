import { jest } from "@jest/globals";
import { completeHTTP } from "../../src/responses-http/completion.mjs";

test("dispatches synthetic HTTP completion", async () => {
  const onCompleted = jest.fn();
  await expect(completeHTTP(Promise.resolve({ id: "r" }), { onCompleted })).resolves.toEqual({
    id: "r",
  });
  expect(onCompleted).toHaveBeenCalled();
});
test("normalizes completion metadata and wraps request failures", async () => {
  const onEvent = jest.fn();
  const onError = jest.fn();
  const response = { id: "resp", request_id: "req" };
  await completeHTTP(Promise.resolve(response), { onEvent });
  expect(onEvent).toHaveBeenCalledWith(
    expect.objectContaining({ type: "response.completed", responseId: "resp", requestId: "req" }),
    expect.any(Object),
  );
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

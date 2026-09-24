import { jest } from "@jest/globals";
import { wrapHTTPStream } from "../../src/responses-http/stream.mjs";

test("normalizes and dispatches HTTP stream events", async () => {
  const onEvent = jest.fn();
  const events = [];
  for await (const event of wrapHTTPStream(
    (async function* () {
      yield { type: "response.created", response: { id: "r" } };
    })(),
    { onEvent },
  ))
    events.push(event);
  expect(events[0]).toMatchObject({ type: "response.created", responseId: "r" });
  expect(onEvent).toHaveBeenCalled();
});

test("normalizes a stream error and invokes onError", async () => {
  const error = new Error("stream error");
  const onError = jest.fn();
  const stream = wrapHTTPStream(
    (async function* () {
      yield { type: "response.output_text.delta", delta: "before failure" };
      throw error;
    })(),
    { onError },
  );
  await expect(
    (async () => {
      for await (const event of stream) void event;
    })(),
  ).rejects.toMatchObject({
    name: "ResponsesError",
    cause: error,
  });
  expect(onError).toHaveBeenCalled();
});

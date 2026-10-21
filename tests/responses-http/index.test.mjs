import { createHTTPResponsesAdapter } from "../../src/responses-http/index.mjs";

test("composes HTTP creation, streaming, and event callbacks", async () => {
  const response = { id: "resp_1", output: [] };
  const adapter = createHTTPResponsesAdapter({
    create: async (request) =>
      request.stream
        ? (async function* () {
            yield { type: "response.output_text.delta", delta: "hello" };
            yield { type: "response.completed", response };
          })()
        : response,
    stream: async function* () {
      yield { type: "response.completed", response: { id: "resp_2" } };
    },
  });

  await expect(adapter.create({})).resolves.toBe(response);
  const streamed = [];
  for await (const event of adapter.stream({})) streamed.push(event);
  expect(streamed).toMatchObject([{ type: "response.completed", responseId: "resp_2" }]);

  const seen = [];
  const events = [];
  for await (const event of adapter.events({}, { onTextDelta: (text) => seen.push(text) }))
    events.push(event);
  expect(seen).toEqual(["hello"]);
  expect(events.map(({ type }) => type)).toEqual([
    "response.output_text.delta",
    "response.completed",
  ]);
});

import { createHTTPResponsesAdapter } from "../../src/responses-http/index.mjs";

test("composes HTTP response creation and streaming", async () => {
  const response = { id: "resp_1", output: [] };
  const adapter = createHTTPResponsesAdapter({
    create: async (_input, options) =>
      options?.stream
        ? (async function* () {
            yield { type: "response.completed", response };
          })()
        : response,
    stream: async function* () {
      yield { type: "response.completed", response };
    },
  });

  await expect(adapter.create({})).resolves.toBe(response);
  const events = [];
  for await (const event of adapter.stream({})) events.push(event);
  expect(events).toMatchObject([{ type: "response.completed", responseId: "resp_1" }]);
});

test("composes streaming creation with event callbacks", async () => {
  const seen = [];
  const adapter = createHTTPResponsesAdapter({
    create: async function* () {
      yield { type: "response.output_text.delta", delta: "hello" };
      yield { type: "response.completed", response: { id: "resp_2" } };
    },
  });

  const events = [];
  for await (const event of adapter.events({}, { onTextDelta: (text) => seen.push(text) }))
    events.push(event);
  expect(seen).toEqual(["hello"]);
  expect(events.map(({ type }) => type)).toEqual([
    "response.output_text.delta",
    "response.completed",
  ]);
});

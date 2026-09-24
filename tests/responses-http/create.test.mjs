import { jest } from "@jest/globals";
import { createHTTPCreate } from "../../src/responses-http/create.mjs";

test("creates non-streaming and streaming HTTP responses", async () => {
  const responses = {
    create: jest.fn().mockImplementation((request) =>
      request.stream
        ? (async function* () {
            yield { type: "response.completed", response: { id: "r" } };
          })()
        : Promise.resolve({ output: [] }),
    ),
  };
  const create = createHTTPCreate(responses);
  await expect(create({ model: "gpt-5.6" })).resolves.toEqual({ output: [] });
  await expect(create()).resolves.toEqual({ output: [] });
  await expect(create({ model: "gpt-5.6" }, { timeout: 10 })).resolves.toEqual({ output: [] });
  const events = [];
  for await (const event of create({ model: "gpt-5.6", stream: true })) events.push(event);
  expect(events).toMatchObject([{ type: "response.completed", responseId: "r" }]);
  expect(responses.create).toHaveBeenCalledWith({ model: "gpt-5.6", stream: true }, {});
  expect(responses.create).toHaveBeenCalled();
});

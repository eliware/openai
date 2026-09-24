import { jest } from "@jest/globals";
import { createHTTPConvenience } from "../../src/responses-http/convenience.mjs";

test("creates convenience HTTP methods", async () => {
  const adapter = { create: jest.fn().mockResolvedValue(undefined) };
  const responses = {
    stream: jest.fn().mockImplementation(async function* () {
      yield { type: "x" };
    }),
  };
  const methods = createHTTPConvenience(adapter, responses);
  await methods.createWithEvents({});
  methods.events({ model: "gpt-5.6" });
  const values = [];
  for await (const value of methods.stream({ model: "gpt-5.6" })) values.push(value);
  expect(values).toHaveLength(1);
  expect(adapter.create).toHaveBeenCalled();
  expect(responses.stream).toHaveBeenCalled();
  await methods.createWithEvents();
  methods.events();
  const defaultStream = [];
  for await (const value of methods.stream()) defaultStream.push(value);
  expect(defaultStream).toHaveLength(1);
});
test("convenience events opts into streaming and createWithEvents consumes it", async () => {
  const create = jest.fn().mockImplementation(async function* () {
    yield { type: "response.completed" };
  });
  const adapter = { create };
  const methods = createHTTPConvenience(adapter, { stream: jest.fn() });
  const events = methods.events({ model: "gpt-6-luna" });
  expect(create).toHaveBeenCalledWith({ model: "gpt-6-luna", stream: true }, {});
  await methods.createWithEvents({ stream: true });
  expect(create).toHaveBeenCalledTimes(2);
  expect(events).toBeDefined();
});

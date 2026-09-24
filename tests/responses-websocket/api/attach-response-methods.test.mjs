import { attachResponseMethods } from "../../../src/responses-websocket/api/attach-response-methods.mjs";
import { jest } from "@jest/globals";
test("attaches response methods", () => {
  const a = {};
  attachResponseMethods(a);
  expect(a.create).toBeInstanceOf(Function);
  expect(a.createWithEvents).toBeInstanceOf(Function);
  expect(a.stream).toBeInstanceOf(Function);
});
test("delegates create, event creation, and streaming to response handlers", async () => {
  const adapter = {
    _closed: false,
    _activeStreams: new Set(),
    _activeRequest: null,
    ready: async () => {},
    isOpen: () => true,
    socket: {
      send: jest.fn(),
      stream: () =>
        (async function* () {
          yield { type: "message", message: { type: "response.completed", response: { id: "r" } } };
        })(),
    },
  };
  attachResponseMethods(adapter);
  await expect(adapter.create({ model: "gpt-6-luna" })).resolves.toEqual({ id: "r" });
  await adapter.createWithEvents({ model: "gpt-6-luna", stream: true });
  const events = [];
  for await (const event of adapter.stream({ model: "gpt-6-luna" })) events.push(event);
  await adapter.create();
  await adapter.createWithEvents();
  for await (const event of adapter.stream()) void event;
  expect(events).toMatchObject([{ type: "response.completed", responseId: "r" }]);
  expect(adapter.socket.send).toHaveBeenCalledTimes(6);
});

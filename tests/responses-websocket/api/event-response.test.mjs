import { createWithEvents } from "../../../src/responses-websocket/api/event-response.mjs";

test("delegates event creation", async () => {
  const adapter = { _closed: true };
  await expect(createWithEvents(adapter)).rejects.toThrow("closed");
});
test("consumes streaming event creation when stream is requested", async () => {
  const adapter = {
    _closed: false,
    _activeStreams: new Set(),
    _activeRequest: null,
    ready: async () => {},
    isOpen: () => true,
    socket: {
      send() {},
      stream: () =>
        (async function* () {
          yield { type: "message", message: { type: "response.completed", response: { id: "r" } } };
        })(),
    },
  };
  await expect(createWithEvents(adapter, { stream: true })).resolves.toBeUndefined();
});

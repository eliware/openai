import { waitForReadiness } from "../../../src/responses-websocket/lifecycle/readiness.mjs";

test("uses socket events when the socket supports listeners", async () => {
  const handlers = new Map();
  const adapter = {
    socket: {
      socket: {
        on: (name, listener) => handlers.set(name, listener),
        off: (name) => handlers.delete(name),
      },
    },
  };
  const pending = waitForReadiness(adapter);
  handlers.get("open")();
  await expect(pending).resolves.toBeUndefined();
});

test("uses the stream when the socket has no listener API", async () => {
  const adapter = {
    socket: {
      socket: {},
      async *stream() {
        yield { type: "open" };
      },
    },
    isOpen: () => false,
  };
  await expect(waitForReadiness(adapter)).resolves.toBeUndefined();
});

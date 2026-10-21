import { initializeSocket } from "../../../src/mock-transport/socket/state.mjs";
test("initializes mock socket state", () => {
  const socket = { emit: () => {} };
  initializeSocket(socket, { autoOpen: false, events: [] }, [], "url", "proto");
  expect(socket.url).toBe("url");
  expect(socket.readyState).toBe(0);
  expect(socket._events).toEqual([]);
});

test("uses configured event arrays before constructor events", () => {
  const configured = [{ type: "configured" }];
  const socket = { emit: () => {} };

  initializeSocket(socket, { autoOpen: false, events: configured }, [{ type: "default" }], "url");

  expect(socket._events).toEqual(configured);
});

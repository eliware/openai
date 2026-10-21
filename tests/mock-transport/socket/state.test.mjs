import { initializeSocket } from "../../../src/mock-transport/socket/state.mjs";
test("initializes mock socket state", () => {
  const socket = { emit: () => {} };
  initializeSocket(socket, { autoOpen: false, events: [] }, [], "url", "proto");
  expect(socket.url).toBe("url");
  expect(socket.readyState).toBe(0);
});

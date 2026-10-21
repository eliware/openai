import { registerInstance } from "../../../src/mock-transport/socket/instances.mjs";

test("registers a socket instance with its mock class", () => {
  const MockSocket = { instances: [] };
  const socket = {};
  expect(registerInstance(MockSocket, socket)).toBe(socket);
  expect(MockSocket.instances).toEqual([socket]);
});

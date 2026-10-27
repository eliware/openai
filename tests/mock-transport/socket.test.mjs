import { jest } from "@jest/globals";
import {
  composeMockSocketMethods,
  initializeMockSocket,
} from "../../src/mock-transport/socket.mjs";
import { createMockSocketClass } from "../../src/mock-transport/class.mjs";

test("creates an isolated mock socket class", () => {
  const Socket = createMockSocketClass([{ type: "response.completed" }], { autoOpen: false });
  const socket = new Socket("ws://test");
  expect(socket.readyState).toBe(0);
  expect(Socket.instances).toHaveLength(1);
  socket.push({ type: "event" });
  expect(socket.sent).toEqual([]);
  socket.close();
  expect(socket.readyState).toBe(3);
});

test("initializes socket instances and composes their methods", () => {
  const registered = jest.fn();
  const socket = {};
  const defaults = { autoOpen: false, delay: 0, events: [] };

  initializeMockSocket(socket, { register: registered }, defaults, [], "ws://test", ["v1"]);
  class MockSocket {}
  composeMockSocketMethods(MockSocket, defaults);

  expect(socket).toMatchObject({ url: "ws://test", protocols: ["v1"], readyState: 0 });
  expect(registered).toHaveBeenCalledWith(socket);
  expect(socket.listenerMethods).toBeDefined();
  expect(typeof MockSocket.prototype.send).toBe("function");
  expect(typeof MockSocket.prototype.close).toBe("function");
});

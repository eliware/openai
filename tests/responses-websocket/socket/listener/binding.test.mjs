import { jest } from "@jest/globals";
import { createSocketListenerBinding } from "../../../../src/responses-websocket/socket/listener/binding.mjs";

test("binds and unbinds socket listeners", () => {
  const socket = { on: jest.fn(), removeListener: jest.fn() };
  const binding = createSocketListenerBinding(socket);
  const listener = () => {};
  binding.add("message", listener);
  binding.remove("message", listener);
  expect(socket.on).toHaveBeenCalledWith("message", listener);
  expect(socket.removeListener).toHaveBeenCalledWith("message", listener);
});

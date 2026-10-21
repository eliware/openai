import { jest } from "@jest/globals";
import { createSocketListenerBinding } from "../../../../src/responses-websocket/socket/listener/binding.mjs";

test("binds and unbinds socket listeners", () => {
  const socket = { on: jest.fn(), removeListener: jest.fn() };
  const binding = createSocketListenerBinding(socket);
  const listener = () => {};
  const adapted = binding.add("message", listener);
  binding.remove("message", adapted);
  expect(adapted).not.toBe(listener);
  expect(socket.on).toHaveBeenCalledWith("message", adapted);
  expect(socket.removeListener).toHaveBeenCalledWith("message", adapted);
});

test("adapts message payloads when it binds listeners", () => {
  let bound;
  const socket = { on: (event, listener) => (bound = listener), removeListener: jest.fn() };
  const binding = createSocketListenerBinding(socket);
  const received = [];
  const listener = (data, binary) => received.push([data, binary]);
  binding.add("message", listener);
  bound(Buffer.from("payload"), true);
  expect(received).toEqual([["payload", true]]);
  binding.remove("message", bound);
  expect(socket.removeListener).toHaveBeenCalledWith("message", bound);
});

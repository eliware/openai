import { jest } from "@jest/globals";
import { EventEmitter } from "node:events";
import { createListenerRegistry } from "../../../../src/responses-websocket/socket/listener/registry.mjs";
test("registers and removes listeners", () => {
  const raw = { on: jest.fn(), removeListener: jest.fn() };
  const r = createListenerRegistry(raw);
  const fn = () => {};
  r.add("open", fn);
  r.add("message", fn);
  const wrapped = raw.on.mock.calls[1][1];
  r.remove("open", fn);
  r.removeAll();
  r.remove("missing", fn);
  r.removeAll("missing");
  expect(raw.on).toHaveBeenCalled();
  expect(raw.removeListener).toHaveBeenCalled();
  expect(raw.removeListener).toHaveBeenCalledWith("message", wrapped);
});

test("removes duplicate registrations one at a time", () => {
  const socket = new EventEmitter();
  const registry = createListenerRegistry(socket);
  const listener = jest.fn();

  registry.add("open", listener);
  registry.add("open", listener);
  socket.emit("open");
  expect(listener).toHaveBeenCalledTimes(2);

  registry.remove("open", listener);
  socket.emit("open");
  expect(listener).toHaveBeenCalledTimes(3);

  registry.remove("open", listener);
  socket.emit("open");
  expect(listener).toHaveBeenCalledTimes(3);
});

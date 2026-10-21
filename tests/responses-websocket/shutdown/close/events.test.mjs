import { jest } from "@jest/globals";
import { watchCloseEvents } from "../../../../src/responses-websocket/shutdown/close/events.mjs";

test("registers and removes close and error listeners", () => {
  const listeners = new Map();
  const socket = {
    once: (event, listener) => listeners.set(event, listener),
    off: jest.fn((event, listener) => {
      if (listeners.get(event) === listener) listeners.delete(event);
    }),
  };
  const onClose = jest.fn();
  const onError = jest.fn();

  const cleanup = watchCloseEvents(socket, onClose, onError);
  expect(listeners.get("close")).toBe(onClose);
  expect(listeners.get("error")).toBe(onError);

  cleanup();
  expect(socket.off).toHaveBeenNthCalledWith(1, "close", onClose);
  expect(socket.off).toHaveBeenNthCalledWith(2, "error", onError);
  expect(listeners.size).toBe(0);
});

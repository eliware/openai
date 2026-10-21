import { jest } from "@jest/globals";
import { watchCloseResources } from "../../../../src/responses-websocket/shutdown/close/watch-resources.mjs";

afterEach(() => jest.useRealTimers());

test("registers close watchers and clears their timer and listeners", () => {
  jest.useFakeTimers();
  const listeners = new Map();
  const socket = {
    once: (event, listener) => listeners.set(event, listener),
    off: (event, listener) => {
      if (listeners.get(event) === listener) listeners.delete(event);
    },
  };
  const onComplete = jest.fn();

  const cleanup = watchCloseResources(socket, 20, onComplete);
  expect(listeners.has("close")).toBe(true);
  expect(listeners.has("error")).toBe(true);
  expect(jest.getTimerCount()).toBe(1);

  cleanup();
  expect(listeners.size).toBe(0);
  expect(jest.getTimerCount()).toBe(0);
});

test("routes close and error events to the completion callback", () => {
  const listeners = new Map();
  const socket = { once: (event, listener) => listeners.set(event, listener) };
  const onComplete = jest.fn();
  watchCloseResources(socket, 20, onComplete);

  listeners.get("close")();
  const error = new Error("close failed");
  listeners.get("error")(error);

  expect(onComplete).toHaveBeenNthCalledWith(1);
  expect(onComplete).toHaveBeenNthCalledWith(2, error);
});

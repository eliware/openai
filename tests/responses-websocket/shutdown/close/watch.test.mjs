import { jest } from "@jest/globals";
import { watchSocketClose } from "../../../../src/responses-websocket/shutdown/close/watch.mjs";

afterEach(() => jest.useRealTimers());

test("watches close and error events and clears the timeout", () => {
  jest.useFakeTimers();
  const listeners = new Map();
  const onComplete = jest.fn();
  const socket = {
    once: (event, listener) => listeners.set(event, listener),
    off: (event, listener) => {
      if (listeners.get(event) === listener) listeners.delete(event);
    },
  };
  watchSocketClose(socket, 20, onComplete);
  listeners.get("close")();
  expect(onComplete).toHaveBeenCalledWith(undefined);
  expect(listeners.size).toBe(0);
  expect(jest.getTimerCount()).toBe(0);
});

test("reports socket errors once", () => {
  const listeners = new Map();
  const onComplete = jest.fn();
  const socket = {
    once: (event, listener) => listeners.set(event, listener),
    off: () => {},
  };
  watchSocketClose(socket, 20, onComplete);
  const error = new Error("close failed");
  listeners.get("error")(error);
  listeners.get("error")(new Error("late error"));
  expect(onComplete).toHaveBeenCalledTimes(1);
  expect(onComplete).toHaveBeenCalledWith(error);
});

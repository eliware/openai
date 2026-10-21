import { jest } from "@jest/globals";
import { startCloseTimeout } from "../../../../src/responses-websocket/shutdown/close/timeout.mjs";
import { closeSocket } from "../../../../src/responses-websocket/shutdown/socket-close.mjs";

afterEach(() => jest.useRealTimers());

test("terminates the socket and reports a timeout", () => {
  jest.useFakeTimers();
  const socket = { terminate: jest.fn() };
  const onTimeout = jest.fn();
  startCloseTimeout(socket, 10, onTimeout);
  jest.advanceTimersByTime(10);
  expect(socket.terminate).toHaveBeenCalledTimes(1);
  expect(onTimeout).toHaveBeenCalledWith(
    expect.objectContaining({ message: "Responses WebSocket close timed out" }),
  );
});

test("clears the close timer", () => {
  jest.useFakeTimers();
  const onTimeout = jest.fn();
  const clearTimeout = startCloseTimeout({}, 10, onTimeout);
  clearTimeout();
  jest.advanceTimersByTime(10);
  expect(onTimeout).not.toHaveBeenCalled();
});

test("reports a close timeout through the shutdown coordinator", async () => {
  const result = await new Promise((resolve) =>
    closeSocket(
      { socket: { close() {} } },
      { readyState: 1, once() {}, off() {}, terminate() {} },
      {},
      0,
      resolve,
    ),
  );
  expect(result).toMatchObject({ message: "Responses WebSocket close timed out" });
});

test("clears timeout resources and ignores late socket events", () => {
  jest.useFakeTimers();
  try {
    const listeners = new Map();
    const completions = [];
    const socket = {
      readyState: 1,
      once: (event, listener) => listeners.set(event, listener),
      off: (event, listener) => {
        if (listeners.get(event) === listener) listeners.delete(event);
      },
      terminate: jest.fn(),
    };
    closeSocket({ socket: { close() {} } }, socket, {}, 25, (error) => completions.push(error));
    const lateClose = listeners.get("close");
    const lateError = listeners.get("error");

    jest.advanceTimersByTime(25);

    expect(socket.terminate).toHaveBeenCalledTimes(1);
    expect(completions).toHaveLength(1);
    expect(completions[0]).toMatchObject({ message: "Responses WebSocket close timed out" });
    expect(listeners.size).toBe(0);
    expect(jest.getTimerCount()).toBe(0);
    lateClose();
    lateError(new Error("late error"));
    expect(completions).toHaveLength(1);
  } finally {
    jest.useRealTimers();
  }
});

import { jest } from "@jest/globals";
import { startCloseTimeout } from "../../../../src/responses-websocket/shutdown/close/timeout.mjs";

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

import { jest } from "@jest/globals";
import { closeSocket } from "../../../src/responses-websocket/shutdown/socket-close.mjs";

test("closes a socket through the adapter", async () => {
  const socket = {
    readyState: 1,
    once: (name, fn) => {
      if (name === "close") setImmediate(fn);
    },
    off() {},
  };
  let closed = false;
  await new Promise((resolve) =>
    closeSocket(
      {
        socket: {
          close: () => {
            closed = true;
          },
        },
      },
      socket,
      {},
      10,
      (error) => {
        expect(error).toBeUndefined();
        resolve();
      },
    ),
  );
  expect(closed).toBe(true);
});

test("handles absent and already closed sockets", () => {
  const calls = [];
  closeSocket({ socket: {} }, undefined, {}, 1, (error) => calls.push(error));
  closeSocket({ socket: {} }, { readyState: 3 }, {}, 1, (error) => calls.push(error));
  expect(calls).toEqual([undefined, undefined]);
});

test("reports a close timeout", async () => {
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

test("cleans up timeout resources and ignores late socket events", () => {
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
test("completes sockets without event APIs and handles close failures", () => {
  const results = [];
  closeSocket({ socket: { close() {} } }, { readyState: 1 }, {}, 10, (error) =>
    results.push(error),
  );
  closeSocket(
    {
      socket: {
        close() {
          throw new Error("fail");
        },
      },
    },
    { readyState: 1, once() {}, off() {} },
    {},
    10,
    (error) => results.push(error),
  );
  expect(results[0]).toBeUndefined();
  expect(results[1].message).toBe("fail");
});
test("ignores duplicate socket completion events", () => {
  let onClose;
  let onError;
  let completions = 0;
  const socket = {
    readyState: 1,
    once: (event, listener) => {
      if (event === "close") onClose = listener;
      if (event === "error") onError = listener;
    },
    off() {},
  };
  closeSocket({ socket: { close() {} } }, socket, {}, 10, () => {
    completions += 1;
  });
  onClose();
  onClose();
  onError(new Error("late"));
  expect(completions).toBe(1);
});

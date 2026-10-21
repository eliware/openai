import { jest } from "@jest/globals";
import { closeSocket, scheduleSocketOpen } from "../../../src/mock-transport/socket/lifecycle.mjs";

test("schedules the socket open event as a microtask", async () => {
  const emit = jest.fn();
  scheduleSocketOpen({ emit });
  expect(emit).not.toHaveBeenCalled();

  await Promise.resolve();

  expect(emit).toHaveBeenCalledWith("open");
});

test("closes a mock socket", () => {
  const socket = { readyState: 1, _timers: new Set(), emit: () => {} };
  closeSocket(socket, 1000, "OK");
  expect(socket.readyState).toBe(3);
});

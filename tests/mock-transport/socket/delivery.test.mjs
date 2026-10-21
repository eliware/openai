import { afterEach, jest } from "@jest/globals";
import { deliverMessages } from "../../../src/mock-transport/socket/delivery.mjs";

afterEach(() => jest.useRealTimers());

test("selects and schedules the socket event batch", async () => {
  jest.useFakeTimers();
  const emitted = [];
  const event = { type: "response.completed" };
  const socket = {
    _events: [event],
    _timers: new Set(),
    readyState: 1,
    emit: (...args) => emitted.push(args),
  };
  expect(deliverMessages(socket, {}, { delay: 0 })).toBe(socket);
  await jest.advanceTimersByTimeAsync(0);
  expect(emitted).toEqual([["message", JSON.stringify(event), false]]);
});

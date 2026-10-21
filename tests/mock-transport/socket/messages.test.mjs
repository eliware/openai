import { afterEach, jest } from "@jest/globals";
import { sendMessage, pushMessages } from "../../../src/mock-transport/socket/messages.mjs";

afterEach(() => jest.useRealTimers());

test("parses and schedules sent messages", async () => {
  jest.useFakeTimers();
  const sent = [];
  const socket = {
    sent: [],
    _events: [{ type: "response.completed" }],
    _timers: new Set(),
    readyState: 1,
    emit: (...args) => sent.push(args),
  };
  expect(sendMessage(socket, '{"type":"request"}', { delay: 0 })).toBe(socket);
  expect(socket.sent).toEqual([{ type: "request" }]);
  await jest.advanceTimersByTimeAsync(0);
  expect(sent).toEqual([["message", '{"type":"response.completed"}', false]]);
});

test("pushes messages into an open socket", () => {
  const values = [];
  pushMessages({ readyState: 1, emit: (...args) => values.push(args) }, [{ type: "x" }]);
  expect(values).toHaveLength(1);
});

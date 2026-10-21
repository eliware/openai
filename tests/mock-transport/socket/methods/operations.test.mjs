import { createMockSocketOperations } from "../../../../src/mock-transport/socket/methods/operations.mjs";

test("delegates message and lifecycle operations", () => {
  const socket = {
    sent: [],
    readyState: 1,
    _events: [],
    _timers: new Set(),
    emit(event, ...args) {
      this.events.push([event, ...args]);
      return this;
    },
    events: [],
  };
  const methods = createMockSocketOperations({ events: [], delay: 0 });

  expect(methods.send.call(socket, { type: "request" })).toBe(socket);
  expect(socket.sent).toEqual([{ type: "request" }]);
  expect(methods.push.call(socket, { type: "pushed" })).toBe(socket);
  expect(methods.error.call(socket, new Error("failed"))).toBe(socket);
  expect(methods.close.call(socket, 1001, "done")).toBe(socket);
  expect(socket.closed).toEqual({ code: 1001, reason: "done" });
  expect(socket.events.map(([event]) => event)).toEqual(["message", "error", "close"]);
});

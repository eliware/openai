import { createMockSocketClass } from "../../../src/mock-transport/socket.mjs";

test("composes listener, message, and lifecycle methods", () => {
  const Socket = createMockSocketClass([{ type: "response.completed" }], { autoOpen: false });
  const socket = new Socket();
  const events = [];
  const listener = (value) => events.push(value);

  expect(socket.on("on", listener)).toBe(socket);
  socket.emit("on", "on");
  expect(socket.once("once", listener)).toBe(socket);
  socket.emit("once", "once");
  socket.emit("once", "ignored");
  socket.on("off", listener).off("off", listener);
  socket.on("remove", listener).removeListener("remove", listener);
  socket.emit("off", "ignored");
  socket.emit("remove", "ignored");
  expect(events).toEqual(["on", "once"]);

  expect(socket.send({ type: "request" })).toBe(socket);
  expect(socket.sent).toEqual([{ type: "request" }]);
  socket.on("message", (data) => events.push(data));
  socket.push({ type: "pushed" });
  expect(events.at(-1)).toBe(JSON.stringify({ type: "pushed" }));
  socket.on("error", (error) => events.push(error.message));
  expect(socket.error(new Error("failed"))).toBe(socket);
  expect(events.at(-1)).toBe("failed");
  expect(socket.close()).toBe(socket);
  expect(socket.readyState).toBe(3);
});

import { recordPayload } from "../../../src/mock-transport/socket/payload.mjs";

test("parses JSON payloads before it records them", () => {
  const socket = { sent: [] };
  expect(recordPayload(socket, '{"type":"request"}')).toEqual({ type: "request" });
  expect(socket.sent).toEqual([{ type: "request" }]);
});

test("records objects and unparsed string payloads", () => {
  const socket = { sent: [] };
  expect(recordPayload(socket, { type: "object" })).toEqual({ type: "object" });
  expect(recordPayload(socket, "invalid JSON")).toBe("invalid JSON");
  expect(socket.sent).toEqual([{ type: "object" }, "invalid JSON"]);
});

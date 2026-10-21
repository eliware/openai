import { adaptSocketListener } from "../../../../src/responses-websocket/socket/listener/adapt.mjs";

test("adapts socket listener payloads through the socket event wrapper", () => {
  const seen = [];
  const listener = (...args) => seen.push(args);
  adaptSocketListener("message", listener)(Buffer.from("payload"), true);
  adaptSocketListener("close", listener)(1000, Buffer.from("closed"));
  expect(seen).toEqual([
    ["payload", true],
    [1000, "closed"],
  ]);
});

test("keeps listeners unchanged for events without payload adaptation", () => {
  const listener = () => {};
  expect(adaptSocketListener("open", listener)).toBe(listener);
});

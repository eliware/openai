import { wrapSocketListener } from "../../../src/responses-websocket/socket/event-wrapper.mjs";

test("normalizes message and close payloads", () => {
  const values = [];
  wrapSocketListener("message", (...args) => values.push(args))(Buffer.from("x"), true);
  wrapSocketListener("message", (...args) => values.push(args))("text", false);
  wrapSocketListener("close", (...args) => values.push(args))(1000, Buffer.from("bye"));
  wrapSocketListener("close", (...args) => values.push(args))(1001);
  const openListener = (...args) => values.push(args);
  expect(wrapSocketListener("open", openListener)).toBe(openListener);
  expect(values).toEqual([
    ["x", true],
    ["text", false],
    [1000, "bye"],
    [1001, undefined],
  ]);
});

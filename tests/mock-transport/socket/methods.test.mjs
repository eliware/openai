import { createMockSocketMethods } from "../../../src/mock-transport/socket/methods.mjs";

test("composes listener and operation methods", () => {
  expect(Object.keys(createMockSocketMethods({}))).toEqual([
    "on",
    "once",
    "off",
    "removeListener",
    "emit",
    "send",
    "push",
    "error",
    "close",
  ]);
});

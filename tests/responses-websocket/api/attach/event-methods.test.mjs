import { attachEventMethods } from "../../../../src/responses-websocket/api/attach/event-methods.mjs";
test("attaches callable event methods with default request and handler arguments", () => {
  const a = {};
  attachEventMethods(a);
  expect(a.events()).toBeDefined();
  expect(a._request()).toBeDefined();
  expect(a._handleEvent({ type: "other" })).toMatchObject({ type: "other" });
});

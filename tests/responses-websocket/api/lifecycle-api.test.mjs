import {
  handleResponseEvent,
  responseEvents,
} from "../../../src/responses-websocket/api/lifecycle-api.mjs";
test("delegates response event handling with default arguments", () => {
  expect(handleResponseEvent({ type: "other" })).toMatchObject({ type: "other" });
  expect(responseEvents({})).toBeDefined();
});

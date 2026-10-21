import { HANDLER_KEYS } from "../../../src/responses-http/callback/keys.mjs";

test("lists the supported response callback options", () => {
  expect(HANDLER_KEYS).toContain("onEvent");
  expect(HANDLER_KEYS).toContain("onResponseCompleted");
  expect(HANDLER_KEYS).toContain("signal");
});

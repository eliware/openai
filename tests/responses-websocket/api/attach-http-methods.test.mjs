import { attachHttpMethods } from "../../../src/responses-websocket/api/attach-http-methods.mjs";
import { jest } from "@jest/globals";
test("attaches HTTP delegation methods", () => {
  const a = {};
  attachHttpMethods(a);
  expect(Object.keys(a)).toEqual(["retrieve", "delete", "cancel", "parse"]);
});
test("delegates each attached HTTP method with its arguments", async () => {
  const methods = ["retrieve", "delete", "cancel", "parse"];
  const httpResponses = Object.fromEntries(
    methods.map((name) => [name, jest.fn((...args) => args)]),
  );
  const adapter = { httpResponses };
  attachHttpMethods(adapter);
  for (const name of methods) {
    const args = [{ id: "response" }, { query: true }];
    expect(adapter[name](...args)).toEqual(args);
    expect(httpResponses[name]).toHaveBeenCalledWith(...args);
  }
});

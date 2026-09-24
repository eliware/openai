import { delegateHttp } from "../../../src/responses-websocket/api/http.mjs";

test("delegates an HTTP helper call", async () => {
  const adapter = { httpResponses: { retrieve: async (value) => value } };
  await expect(delegateHttp(adapter, "retrieve", ["id"])).resolves.toBe("id");
});
test("forwards all helper arguments and return values", async () => {
  const options = { query: true };
  const args = [{ id: "resp" }, options];
  const httpResponses = { parse: (...received) => received };
  expect(delegateHttp({ httpResponses }, "parse", args)).toEqual(args);
});

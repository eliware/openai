import { ResponsesError } from "../../src/errors/responses-error.mjs";
test("constructs a normalized response error", () => {
  const cause = new Error("source");
  expect(new ResponsesError("bad", { event: { type: "error" }, cause })).toMatchObject({
    name: "ResponsesError",
    message: "bad",
    cause,
  });
});

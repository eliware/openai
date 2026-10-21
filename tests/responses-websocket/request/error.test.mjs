import { jest } from "@jest/globals";
import { logRequestError } from "../../../src/responses-websocket/request/error.mjs";

test.each([
  [{ name: "AbortError" }, "warn"],
  [{ event: { type: "abort" } }, "warn"],
  [new Error("failed"), "error"],
])("logs request errors at the correct level", (error, level) => {
  const logger = { log: jest.fn() };
  logRequestError(logger, error);
  expect(logger.log).toHaveBeenCalledWith(
    level,
    "Responses request failed",
    expect.objectContaining({ transport: "websocket" }),
  );
});

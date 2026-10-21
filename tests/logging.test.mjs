import { jest } from "@jest/globals";
import { writeLog } from "../src/logging.mjs";

test("writes structured package context to the injected logger", () => {
  const logger = { log: jest.fn() };
  writeLog(logger, "info", "Responses request completed", { operation: "responses.create" });
  expect(logger.log).toHaveBeenCalledWith("info", "Responses request completed", {
    component: "@eliware/openai",
    operation: "responses.create",
  });
});

test("does not require a logger and ignores logger failures", () => {
  expect(() => writeLog(undefined, "debug", "Responses request started", {})).not.toThrow();
  expect(() =>
    writeLog(
      {
        log: () => {
          throw new Error("logger failure");
        },
      },
      "info",
      "done",
      {},
    ),
  ).not.toThrow();
});

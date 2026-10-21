import { jest } from "@jest/globals";
import {
  logRequestFailed,
  logRequestStarted,
} from "../../../src/responses-websocket/request/logging.mjs";

test("logs request start and failure with WebSocket context", () => {
  const logger = { log: jest.fn() };
  logRequestStarted(logger);
  logRequestFailed(logger, { name: "AbortError" });
  expect(logger.log).toHaveBeenNthCalledWith(
    1,
    "debug",
    "Responses request started",
    expect.objectContaining({ transport: "websocket" }),
  );
  expect(logger.log).toHaveBeenNthCalledWith(
    2,
    "warn",
    "Responses request failed",
    expect.objectContaining({ transport: "websocket" }),
  );
});

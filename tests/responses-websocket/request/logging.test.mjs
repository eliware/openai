import { jest } from "@jest/globals";
import {
  logRequestFailed,
  logRequestMessage,
  logRequestStarted,
  logRequestTransport,
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

test("logs message and transport events", () => {
  const logger = { log: jest.fn() };
  logRequestMessage(logger, "response.completed");
  logRequestTransport(logger, undefined);
  expect(logger.log).toHaveBeenNthCalledWith(
    1,
    "verbose",
    "Responses stream event",
    expect.objectContaining({ transport: "websocket", eventType: "response.completed" }),
  );
  expect(logger.log).toHaveBeenNthCalledWith(
    2,
    "info",
    "Responses request completed",
    expect.objectContaining({ transport: "websocket" }),
  );
  expect(logger.log).toHaveBeenNthCalledWith(
    3,
    "silly",
    "Responses transport event",
    expect.objectContaining({ eventType: "unknown" }),
  );
});

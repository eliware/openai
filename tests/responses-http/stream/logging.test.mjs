import { jest } from "@jest/globals";
import {
  logHTTPStreamEvent,
  logHTTPStreamFailure,
} from "../../../src/responses-http/stream/logging.mjs";

test("logs stream event types and completion", () => {
  const logger = { log: jest.fn() };
  logHTTPStreamEvent(logger, {});
  logHTTPStreamEvent(logger, { type: "response.completed" });
  expect(logger.log).toHaveBeenNthCalledWith(
    1,
    "verbose",
    "Responses stream event",
    expect.objectContaining({ eventType: "unknown" }),
  );
  expect(logger.log).toHaveBeenNthCalledWith(
    3,
    "info",
    "Responses request completed",
    expect.any(Object),
  );
});

test("logs stream failures through HTTP logging", () => {
  const logger = { log: jest.fn() };
  logHTTPStreamFailure(logger, { event: { type: "abort" } });
  expect(logger.log).toHaveBeenCalledWith("warn", "Responses request failed", expect.any(Object));
});

import { jest } from "@jest/globals";
import { logHTTPStreamEvent } from "../../../src/responses-http/stream/logging.mjs";

test("logs stream event types", () => {
  const logger = { log: jest.fn() };
  logHTTPStreamEvent(logger, {});
  expect(logger.log).toHaveBeenNthCalledWith(
    1,
    "verbose",
    "Responses stream event",
    expect.objectContaining({ eventType: "unknown" }),
  );
});

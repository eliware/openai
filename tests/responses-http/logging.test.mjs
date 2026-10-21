import { jest } from "@jest/globals";
import { logHTTP } from "../../src/responses-http/logging.mjs";

test("writes HTTP request lifecycle records with shared context", () => {
  const logger = { log: jest.fn() };
  logHTTP(logger, "started");
  logHTTP(logger, "sent");
  logHTTP(logger, "completed");
  logHTTP(logger, "failed", new Error("failed"));
  logHTTP(logger, "failed", { event: { type: "abort" } });
  logHTTP(logger, "stream-event", { type: "response.output_text.delta" });
  logHTTP(logger, "stream-event", {});
  logHTTP(logger, "unknown");
  expect(logger.log).toHaveBeenCalledTimes(7);
  expect(logger.log.mock.calls).toEqual([
    ["debug", "Responses request started", expect.objectContaining({ transport: "http" })],
    ["http", "Responses request sent", expect.objectContaining({ transport: "http" })],
    ["info", "Responses request completed", expect.objectContaining({ transport: "http" })],
    ["error", "Responses request failed", expect.objectContaining({ transport: "http" })],
    ["warn", "Responses request failed", expect.objectContaining({ transport: "http" })],
    [
      "verbose",
      "Responses stream event",
      expect.objectContaining({ eventType: "response.output_text.delta" }),
    ],
    ["verbose", "Responses stream event", expect.objectContaining({ eventType: "unknown" })],
  ]);
});

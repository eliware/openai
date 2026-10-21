import { writeLog } from "../logging.mjs";

const CONTEXT = { operation: "responses.create", transport: "http" };

export function logHTTP(logger, action, event) {
  if (action === "started") writeLog(logger, "debug", "Responses request started", CONTEXT);
  else if (action === "sent") writeLog(logger, "http", "Responses request sent", CONTEXT);
  else if (action === "completed") writeLog(logger, "info", "Responses request completed", CONTEXT);
  else if (action === "failed")
    writeLog(
      logger,
      event?.event?.type === "abort" ? "warn" : "error",
      "Responses request failed",
      CONTEXT,
    );
  else if (action === "stream-event")
    writeLog(logger, "verbose", "Responses stream event", {
      ...CONTEXT,
      eventType: typeof event?.type === "string" ? event.type : "unknown",
    });
}

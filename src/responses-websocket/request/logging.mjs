import { writeLog } from "../../logging.mjs";

const CONTEXT = { operation: "responses.create", transport: "websocket" };

export function logRequestStarted(logger) {
  writeLog(logger, "debug", "Responses request started", CONTEXT);
}

export function logRequestMessage(logger, eventType) {
  writeLog(logger, "verbose", "Responses stream event", {
    ...CONTEXT,
    eventType: typeof eventType === "string" ? eventType : "unknown",
  });
  if (eventType === "response.completed")
    writeLog(logger, "info", "Responses request completed", CONTEXT);
}

export function logRequestTransport(logger, eventType) {
  writeLog(logger, "silly", "Responses transport event", {
    ...CONTEXT,
    eventType: typeof eventType === "string" ? eventType : "unknown",
  });
}

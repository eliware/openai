import { writeLog } from "../../logging.mjs";

const CONTEXT = { operation: "responses.create", transport: "websocket" };

export function logRequestStarted(logger) {
  writeLog(logger, "debug", "Responses request started", CONTEXT);
}

export function logRequestFailed(logger, error) {
  const level = error?.event?.type === "abort" || error?.name === "AbortError" ? "warn" : "error";
  writeLog(logger, level, "Responses request failed", CONTEXT);
}

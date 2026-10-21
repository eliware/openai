import { writeLog } from "../../logging.mjs";

export function logRequestError(logger, error) {
  const level = error?.event?.type === "abort" || error?.name === "AbortError" ? "warn" : "error";
  writeLog(logger, level, "Responses request failed", {
    operation: "responses.create",
    transport: "websocket",
  });
}

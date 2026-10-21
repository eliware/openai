import { dispatch } from "./callback/dispatch.mjs";
import { normalizeStreamError } from "./stream-errors.mjs";
import { writeLog } from "../logging.mjs";

export async function* wrapHTTPStream(stream, handlers, logger) {
  try {
    for await (const event of await stream) {
      writeLog(logger, "verbose", "Responses stream event", {
        operation: "responses.create",
        transport: "http",
        eventType: typeof event?.type === "string" ? event.type : "unknown",
      });
      if (event?.type === "response.completed")
        writeLog(logger, "info", "Responses request completed", {
          operation: "responses.create",
          transport: "http",
        });
      yield dispatch(event, handlers);
    }
  } catch (error) {
    const responseError = normalizeStreamError(error, handlers);
    writeLog(
      logger,
      error?.event?.type === "abort" ? "warn" : "error",
      "Responses request failed",
      {
        operation: "responses.create",
        transport: "http",
      },
    );
    throw responseError;
  }
}

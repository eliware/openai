import { normalizeEvent } from "../events/normalize.mjs";
import { responsesErrorFrom } from "../errors/http-normalize.mjs";
import { dispatch } from "./callback/dispatch.mjs";
import { writeLog } from "../logging.mjs";

export function completeHTTP(result, handlers, logger) {
  return Promise.resolve(result).then(
    (response) => {
      writeLog(logger, "info", "Responses request completed", {
        operation: "responses.create",
        transport: "http",
      });
      const event = normalizeEvent({
        type: "response.completed",
        response,
        response_id: response?.id,
        request_id: response?.request_id,
      });
      dispatch(event, handlers);
      return response;
    },
    (error) => {
      writeLog(
        logger,
        error?.event?.type === "abort" ? "warn" : "error",
        "Responses request failed",
        {
          operation: "responses.create",
          transport: "http",
        },
      );
      const responseError = responsesErrorFrom(error, { type: "error" });
      handlers.onError?.(responseError, normalizeEvent(responseError.event));
      throw responseError;
    },
  );
}

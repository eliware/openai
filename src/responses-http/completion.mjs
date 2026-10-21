import { normalizeEvent } from "../events/normalize.mjs";
import { responsesErrorFrom } from "../errors/http-normalize.mjs";
import { dispatch } from "./callback/dispatch.mjs";
import { logHTTP } from "./logging.mjs";

export function completeHTTP(result, handlers, logger) {
  return Promise.resolve(result).then(
    (response) => {
      logHTTP(logger, "completed");
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
      logHTTP(logger, "failed", error);
      const responseError = responsesErrorFrom(error, { type: "error" });
      handlers.onError?.(responseError, normalizeEvent(responseError.event));
      throw responseError;
    },
  );
}

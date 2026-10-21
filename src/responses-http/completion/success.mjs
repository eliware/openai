import { normalizeEvent } from "../../events/normalize.mjs";
import { dispatch } from "../callback/dispatch.mjs";
import { logHTTP } from "../logging.mjs";

export function completeHTTPSuccess(response, handlers, logger) {
  logHTTP(logger, "completed");
  const event = normalizeEvent({
    type: "response.completed",
    response,
    response_id: response?.id,
    request_id: response?.request_id,
  });
  dispatch(event, handlers);
  return response;
}

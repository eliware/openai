import { dispatch } from "./callback/dispatch.mjs";
import { normalizeStreamError } from "./stream/errors.mjs";
import { logHTTPStreamEvent, logHTTPStreamFailure } from "./stream/logging.mjs";

export async function* wrapHTTPStream(stream, handlers, logger) {
  try {
    for await (const event of await stream) {
      logHTTPStreamEvent(logger, event);
      yield dispatch(event, handlers);
    }
  } catch (error) {
    const responseError = normalizeStreamError(error, handlers);
    logHTTPStreamFailure(logger, error);
    throw responseError;
  }
}

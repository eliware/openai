import { wrapHTTPStream } from "./stream.mjs";
import { splitRequest } from "./request-options.mjs";
import { completeHTTP } from "./completion.mjs";
import { logHTTP } from "./logging.mjs";

export function createHTTPCreate(responses, logger) {
  return (input = {}, options = {}) => {
    const { handlers, request, requestOptions, streaming } = splitRequest(input, options);
    logHTTP(logger, "started");
    logHTTP(logger, "sent");
    let result;
    try {
      result = responses.create(request, requestOptions);
    } catch (error) {
      logHTTP(logger, "failed", error);
      throw error;
    }
    return streaming
      ? wrapHTTPStream(result, handlers, logger)
      : completeHTTP(result, handlers, logger);
  };
}

import { wrapHTTPStream } from "./stream.mjs";
import { splitRequest } from "./request-options.mjs";
import { completeHTTP } from "./completion.mjs";
import { writeLog } from "../logging.mjs";

export function createHTTPCreate(responses, logger) {
  return (input = {}, options = {}) => {
    const { handlers, request, requestOptions, streaming } = splitRequest(input, options);
    const context = { operation: "responses.create", transport: "http" };
    writeLog(logger, "debug", "Responses request started", context);
    writeLog(logger, "http", "Responses request sent", context);
    let result;
    try {
      result = responses.create(request, requestOptions);
    } catch (error) {
      writeLog(logger, "error", "Responses request failed", context);
      throw error;
    }
    return streaming
      ? wrapHTTPStream(result, handlers, logger)
      : completeHTTP(result, handlers, logger);
  };
}

import { completeHTTPFailure } from "./completion/failure.mjs";
import { completeHTTPSuccess } from "./completion/success.mjs";

export function completeHTTP(result, handlers, logger) {
  return Promise.resolve(result).then(
    (response) => completeHTTPSuccess(response, handlers, logger),
    (error) => completeHTTPFailure(error, handlers, logger),
  );
}

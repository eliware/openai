import { ResponsesError } from "../../errors/responses-error.mjs";
import { normalizeEvent } from "../../events/normalize.mjs";

export function reportRequestError(error, callbacks) {
  const responseError =
    error instanceof ResponsesError
      ? error
      : new ResponsesError(error?.message ?? "Responses WebSocket request failed", {
          event: { type: "error" },
          cause: error,
        });
  callbacks.onError?.(responseError, normalizeEvent(responseError.event));
  return responseError;
}

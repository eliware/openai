import { reportRequestError } from "./report-error.mjs";

export async function readRequestEvent(next, callbacks, wasAborted, signal) {
  try {
    return await next();
  } catch (error) {
    if (wasAborted() || signal?.aborted) {
      callbacks.onError?.(error, { type: "abort" });
      throw error;
    }
    throw reportRequestError(error, callbacks);
  }
}

import { abortError } from "../errors/abort.mjs";
import { openRequest } from "./request/session.mjs";
import { cleanupRequest } from "./request/cleanup.mjs";
import { sendRequest } from "./request/send.mjs";
import { ensureReady } from "./request/ready.mjs";
import { readResponseEvents } from "./request/loop.mjs";
import { logRequestStarted, logRequestFailed } from "./request/logging.mjs";

export async function* requestEvents(adapter, response, options = {}) {
  logRequestStarted(adapter.logger);
  let request;
  try {
    request = openRequest(adapter, response, options);
    const { signal, callbacks, controller, next, control } = request;
    const abort = () => abortError(signal);
    await ensureReady(adapter, signal, callbacks);
    if (signal?.aborted) {
      const error = abort();
      callbacks.onError?.(error, { type: "abort" });
      throw error;
    }
    sendRequest(adapter, response, callbacks);
    yield* readResponseEvents(next, callbacks, controller, signal, control, adapter.logger);
  } catch (error) {
    logRequestFailed(adapter.logger, error);
    throw error;
  } finally {
    if (request) cleanupRequest(adapter, request.events, request.signal, request.onAbort);
  }
}

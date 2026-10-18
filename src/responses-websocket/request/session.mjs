import { ResponsesError } from "../../errors/responses-error.mjs";
import { abortError } from "../../errors/abort.mjs";
import { prepareRequest } from "./options.mjs";
import { createAbortController } from "./abort.mjs";
import { createRequestControlState } from "./control/state.mjs";

export function openRequest(adapter, response, options) {
  const { signal, callbacks } = prepareRequest(options);
  const abort = () => abortError(signal);
  if (signal?.aborted) {
    const error = abort();
    callbacks.onError?.(error, { type: "abort" });
    throw error;
  }
  if (adapter._activeRequest ?? adapter._requestActive)
    throw new ResponsesError("Concurrent Responses WebSocket requests are not supported");
  const control = createRequestControlState();
  const events = adapter.socket.stream();
  adapter._activeRequest = control;
  adapter._activeStreams.add(events);
  const controller = createAbortController(adapter, events, signal);
  const { onAbort, next } = controller;
  signal?.addEventListener("abort", onAbort, { once: true });
  return { signal, callbacks, events, controller, onAbort, next, control };
}

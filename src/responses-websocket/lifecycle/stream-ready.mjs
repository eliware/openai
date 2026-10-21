import { ResponsesError } from "../../errors/responses-error.mjs";
import { abortError } from "../../errors/abort.mjs";
import { waitForNextEvent } from "./next-event.mjs";

export async function waitForStream(adapter, signal) {
  const events = adapter.socket.stream();
  try {
    while (true) {
      if (signal?.aborted) throw abortError(signal);
      const event = await waitForNextEvent(events, signal);
      if (event.done) break;
      const value = event.value;
      if (value.type === "open" || adapter.isOpen()) return;
      if (value.type === "error")
        throw new ResponsesError(value.error?.message ?? "Responses WebSocket error", {
          event: value,
          cause: value.error,
        });
      if (value.type === "close")
        throw new ResponsesError("Responses WebSocket closed before the socket opened", {
          event: value,
        });
    }
    throw new ResponsesError("Responses WebSocket ended before the socket opened");
  } finally {
    await events.return?.();
  }
}

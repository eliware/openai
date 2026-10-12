import { ResponsesError } from "../../errors/responses-error.mjs";
import { abortError } from "../../errors/abort.mjs";

export async function waitForStream(adapter, signal) {
  const events = adapter.socket.stream();
  try {
    while (true) {
      if (signal?.aborted) throw abortError(signal);
      const pending = events.next();
      const event = signal
        ? await Promise.race([
            pending,
            new Promise((_, reject) => {
              const onAbort = () => reject(abortError(signal));
              signal.addEventListener("abort", onAbort, { once: true });
              const cleanup = () => signal.removeEventListener("abort", onAbort);
              pending.then(cleanup, cleanup);
            }),
          ])
        : await pending;
      if (event.done) break;
      const value = event.value;
      if (value.type === "open" || adapter.isOpen()) return;
      if (value.type === "error")
        throw new ResponsesError(value.error?.message ?? "Responses WebSocket error", {
          event: value,
          cause: value.error,
        });
      if (value.type === "close")
        throw new ResponsesError("Responses WebSocket closed before becoming ready", {
          event: value,
        });
    }
    throw new ResponsesError("Responses WebSocket ended before becoming ready");
  } finally {
    await events.return?.();
  }
}

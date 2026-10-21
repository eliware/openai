import { abortError } from "../../errors/abort.mjs";

export function waitForNextEvent(events, signal) {
  if (!signal) return events.next();
  if (signal.aborted) return Promise.reject(abortError(signal));

  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => signal.removeEventListener("abort", onAbort);
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback(value);
    };
    const onAbort = () => finish(reject, abortError(signal));
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) {
      onAbort();
      return;
    }
    Promise.resolve(events.next()).then(
      (event) => finish(resolve, event),
      (error) => finish(reject, error),
    );
  });
}

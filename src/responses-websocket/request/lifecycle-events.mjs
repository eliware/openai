import { processConnectionLifecycleEvent } from "./lifecycle/connection.mjs";
import { processLifecycleFailure } from "./lifecycle/failure.mjs";

export function processLifecycleEvent(event, callbacks) {
  if (event.type === "connecting" || event.type === "open") {
    return processConnectionLifecycleEvent(event, callbacks);
  }
  return processLifecycleFailure(event);
}

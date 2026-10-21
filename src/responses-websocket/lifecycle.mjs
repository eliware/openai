import { waitForReadiness } from "./lifecycle/readiness.mjs";

export function ready(adapter, signal) {
  if (adapter.isOpen()) return Promise.resolve();
  return waitForReadiness(adapter, signal);
}

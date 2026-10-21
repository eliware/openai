import { reportRequestError } from "./report-error.mjs";

export async function ensureReady(adapter, signal, callbacks) {
  try {
    await adapter.ready(signal);
  } catch (error) {
    throw reportRequestError(error, callbacks);
  }
}

import { wrapSocketListener } from "../event-wrapper.mjs";

export function adaptSocketListener(event, listener) {
  return wrapSocketListener(event, listener);
}

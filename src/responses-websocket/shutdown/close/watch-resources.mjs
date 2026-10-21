import { watchCloseEvents } from "./events.mjs";
import { startCloseTimeout } from "./timeout.mjs";

export function watchCloseResources(socket, timeout, onComplete) {
  const clearTimeout = startCloseTimeout(socket, timeout, onComplete);
  const clearEvents = watchCloseEvents(
    socket,
    () => onComplete(),
    (error) => onComplete(error),
  );
  return () => {
    clearTimeout();
    clearEvents();
  };
}

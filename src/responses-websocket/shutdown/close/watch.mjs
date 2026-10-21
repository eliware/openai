import { watchCloseEvents } from "./events.mjs";
import { startCloseTimeout } from "./timeout.mjs";

export function watchSocketClose(socket, timeout, onComplete) {
  let settled = false;
  let clearCloseTimeout;
  let clearCloseEvents = () => {};
  const cleanup = () => {
    clearCloseTimeout?.();
    clearCloseEvents();
  };
  const done = (error) => {
    if (settled) return;
    settled = true;
    cleanup();
    onComplete(error);
  };
  const onClose = () => done();
  const onError = (error) => done(error);
  clearCloseTimeout = startCloseTimeout(socket, timeout, done);
  clearCloseEvents = watchCloseEvents(socket, onClose, onError);
  return done;
}

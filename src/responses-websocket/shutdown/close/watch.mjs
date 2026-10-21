import { startCloseTimeout } from "./timeout.mjs";

export function watchSocketClose(socket, timeout, onComplete) {
  let settled = false;
  let clearCloseTimeout;
  const cleanup = () => {
    clearCloseTimeout?.();
    socket.off?.("close", onClose);
    socket.off?.("error", onError);
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
  socket.once?.("close", onClose);
  socket.once?.("error", onError);
  return done;
}

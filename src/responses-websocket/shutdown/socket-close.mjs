import { startCloseTimeout } from "./close/timeout.mjs";

export function closeSocket(adapter, socket, socketProps, timeout, onComplete) {
  if (!socket || socket.readyState === 3 || typeof adapter.socket.close !== "function") {
    onComplete();
    return;
  }
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
  try {
    adapter.socket.close(socketProps);
    if (
      socket.readyState === 3 ||
      socket.socket?.closed === true ||
      (!socket.once && !socket.addEventListener)
    )
      done();
  } catch (error) {
    done(error);
  }
}

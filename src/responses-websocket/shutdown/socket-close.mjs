import { watchSocketClose } from "./close/watch.mjs";
import { shouldCompleteSocketClose } from "./close/should-complete.mjs";

export function closeSocket(adapter, socket, socketProps, timeout, onComplete) {
  if (!socket || socket.readyState === 3 || typeof adapter.socket.close !== "function") {
    onComplete();
    return;
  }
  const done = watchSocketClose(socket, timeout, onComplete);
  try {
    adapter.socket.close(socketProps);
    if (shouldCompleteSocketClose(socket)) done();
  } catch (error) {
    done(error);
  }
}

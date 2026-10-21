import { watchSocketClose } from "./close/watch.mjs";

export function closeSocket(adapter, socket, socketProps, timeout, onComplete) {
  if (!socket || socket.readyState === 3 || typeof adapter.socket.close !== "function") {
    onComplete();
    return;
  }
  const done = watchSocketClose(socket, timeout, onComplete);
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

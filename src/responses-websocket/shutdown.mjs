import { cancelStreams } from "./shutdown/stream-cleanup.mjs";
import { closeSocket } from "./shutdown/socket-close.mjs";
import { reuseClosePromise } from "./shutdown/close/promise.mjs";

export function close(adapter, props = {}) {
  const { timeout = 30_000, ...socketProps } = props ?? {};
  return reuseClosePromise(
    adapter,
    () =>
      new Promise((resolve, reject) => {
        cancelStreams(adapter._activeStreams);
        closeSocket(adapter, adapter.socket.socket, socketProps, timeout, (error) => {
          if (error) reject(error);
          else {
            adapter._closed = true;
            resolve();
          }
        });
      }),
  );
}

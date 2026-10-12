import { waitForSocket } from "./lifecycle/socket-ready.mjs";
import { waitForStream } from "./lifecycle/stream-ready.mjs";

export function ready(adapter, signal) {
  if (adapter.isOpen()) return Promise.resolve();
  const socket = adapter.socket.socket;
  if (typeof socket?.on !== "function") return waitForStream(adapter, signal);
  return waitForSocket(socket, signal);
}

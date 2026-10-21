import { waitForSocket } from "./socket-ready.mjs";
import { waitForStream } from "./stream-ready.mjs";

export function waitForReadiness(adapter, signal) {
  const socket = adapter.socket.socket;
  if (typeof socket?.on !== "function") return waitForStream(adapter, signal);
  return waitForSocket(socket, signal);
}

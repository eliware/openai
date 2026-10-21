import { recordPayload } from "./payload.mjs";
import { deliverMessages } from "./delivery.mjs";

export function sendMessage(socket, data, defaults) {
  recordPayload(socket, data);
  deliverMessages(socket, data, defaults);
  return socket;
}
export function pushMessages(socket, messages) {
  if (socket.readyState === 3) return socket;
  for (const event of messages) socket.emit("message", JSON.stringify(event), false);
  return socket;
}

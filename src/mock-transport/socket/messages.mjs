import { scheduleEvents } from "../scheduler.mjs";
import { selectEvents } from "./event-selection.mjs";
import { recordPayload } from "./payload.mjs";

export function sendMessage(socket, data, defaults) {
  recordPayload(socket, data);
  const batch = selectEvents(socket, data, defaults);
  scheduleEvents(socket, batch, defaults.delay, socket.emit.bind(socket));
  return socket;
}
export function pushMessages(socket, messages) {
  if (socket.readyState === 3) return socket;
  for (const event of messages) socket.emit("message", JSON.stringify(event), false);
  return socket;
}

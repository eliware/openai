import { scheduleEvents } from "../scheduler.mjs";
import { selectEvents } from "./event-selection.mjs";

export function deliverMessages(socket, data, defaults) {
  const events = selectEvents(socket, data, defaults);
  scheduleEvents(socket, events, defaults.delay, socket.emit.bind(socket));
  return socket;
}

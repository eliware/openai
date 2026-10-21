export function selectEvents(socket, data, defaults) {
  const events =
    typeof defaults.events === "function" ? defaults.events(data, socket) : socket._events;
  if (!Array.isArray(events))
    throw new TypeError("Mock transport event factory must return an array");
  return events;
}

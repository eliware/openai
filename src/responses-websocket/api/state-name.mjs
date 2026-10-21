export function getStateName(adapter) {
  if (adapter._closePromise && !adapter._closed) return "closing";
  const states = ["connecting", "open", "closing", "closed"];
  const readyState = adapter.socket.socket?.readyState ?? 3;
  return states[readyState] ?? "closed";
}

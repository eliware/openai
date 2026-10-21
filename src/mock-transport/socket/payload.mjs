export function recordPayload(socket, data) {
  let payload = data;
  if (typeof data === "string") {
    try {
      payload = JSON.parse(data);
    } catch {}
  }
  socket.sent.push(payload);
  return payload;
}

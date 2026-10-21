export function watchCloseEvents(socket, onClose, onError) {
  socket.once?.("close", onClose);
  socket.once?.("error", onError);
  return () => {
    socket.off?.("close", onClose);
    socket.off?.("error", onError);
  };
}

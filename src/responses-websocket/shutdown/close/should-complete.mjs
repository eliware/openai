export function shouldCompleteSocketClose(socket) {
  return (
    !socket ||
    socket.readyState === 3 ||
    socket.socket?.closed === true ||
    (!socket.once && !socket.addEventListener)
  );
}

export function registerInstance(MockSocket, socket) {
  MockSocket.instances.push(socket);
  return socket;
}

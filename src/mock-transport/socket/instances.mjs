export function createInstanceRegistry() {
  const instances = [];
  return {
    instances,
    register(socket) {
      instances.push(socket);
      return socket;
    },
  };
}

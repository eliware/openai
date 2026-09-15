export function attachSocketMethods(adapter) {
  adapter.on = (...args) => { adapter.socket.on(...args); return adapter; };
  adapter.off = (...args) => { adapter.socket.off(...args); return adapter; };
  return adapter;
}

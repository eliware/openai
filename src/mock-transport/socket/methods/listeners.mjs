export function createMockSocketListenerDelegates() {
  return {
    on(event, listener) {
      return this.listenerMethods.on(event, listener);
    },
    once(event, listener) {
      return this.listenerMethods.once(event, listener);
    },
    off(event, listener) {
      return this.listenerMethods.off(event, listener);
    },
    removeListener(event, listener) {
      return this.listenerMethods.removeListener(event, listener);
    },
    emit(event, ...args) {
      return this.listenerMethods.emit(event, ...args);
    },
  };
}

export function createMockResponsesTransport(events = []) {
  return class MockResponsesWebSocket {
    static OPEN = 1; static CONNECTING = 0; static CLOSING = 2; static CLOSED = 3;
    constructor() { this.readyState = 0; this.listeners = new Map(); queueMicrotask(() => { this.readyState = 1; this.emit('open'); }); }
    on(event, listener) { const list = this.listeners.get(event) ?? []; list.push(listener); this.listeners.set(event, list); }
    removeListener(event, listener) { this.listeners.set(event, (this.listeners.get(event) ?? []).filter(item => item !== listener)); }
    emit(event, ...args) { for (const listener of this.listeners.get(event) ?? []) listener(...args); }
    send() { for (const event of events) queueMicrotask(() => this.emit('message', JSON.stringify(event), false)); }
    close(code = 1000, reason = 'OK') { this.readyState = 3; this.emit('close', code, reason); }
  };
}

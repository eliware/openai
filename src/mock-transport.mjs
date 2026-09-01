export function createMockResponsesTransport(events = [], options = {}) {
  const defaults = { autoOpen: true, delay: 0, ...options };
  return class MockResponsesWebSocket {
    static OPEN = 1; static CONNECTING = 0; static CLOSING = 2; static CLOSED = 3;
    static instances = [];
    constructor(url = '', protocols) {
      this.url = url; this.protocols = protocols; this.readyState = defaults.autoOpen ? 1 : 0;
      this.listeners = new Map(); this.sent = []; this.closed = false; this._timers = new Set(); this._events = [...events];
      MockResponsesWebSocket.instances.push(this);
      if (defaults.autoOpen) queueMicrotask(() => this.emit('open'));
    }
    on(event, listener) { const list = this.listeners.get(event) ?? []; list.push(listener); this.listeners.set(event, list); return this; }
    once(event, listener) { const once = (...args) => { this.removeListener(event, once); listener(...args); }; return this.on(event, once); }
    off(event, listener) { return this.removeListener(event, listener); }
    removeListener(event, listener) { this.listeners.set(event, (this.listeners.get(event) ?? []).filter(item => item !== listener)); return this; }
    emit(event, ...args) { for (const listener of (this.listeners.get(event) ?? [])) listener(...args); return this; }
    send(data) {
      this.sent.push(typeof data === 'string' ? JSON.parse(data) : data);
      const batch = typeof defaults.events === 'function' ? defaults.events(data, this) : this._events;
      if (!Array.isArray(batch)) throw new TypeError('Mock transport event factory must return an array');
      for (const event of batch) { const timer = setTimeout(() => { this._timers.delete(timer); if (this.readyState !== 3) this.emit('message', JSON.stringify(event), false); }, defaults.delay); this._timers.add(timer); }
      return this;
    }
    push(...messages) { for (const event of messages) this.emit('message', JSON.stringify(event), false); return this; }
    error(error = new Error('mock socket error')) { this.emit('error', error); return this; }
    reconnect() { this.readyState = 0; this.emit('close', 1006, 'reconnecting'); this.readyState = 1; this.emit('open'); return this; }
    close(code = 1000, reason = 'OK') { if (this.readyState === 3) return this; this.readyState = 3; for (const timer of this._timers) clearTimeout(timer); this._timers.clear(); this.closed = { code, reason }; this.emit('close', code, reason); return this; }
  };
}

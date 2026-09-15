import { addListener, removeListener, emit } from './listeners.mjs';
import { initializeSocket } from './socket-state.mjs';
import { sendMessage, pushMessages } from './socket-messages.mjs';
import { closeSocket } from './socket-lifecycle.mjs';

export function createMockSocketClass(events, options) {
  const defaults = { autoOpen: true, delay: 0, ...options };
  return class MockResponsesWebSocket {
    static OPEN = 1; static CONNECTING = 0; static CLOSING = 2; static CLOSED = 3; static instances = [];
    constructor(url = '', protocols) { initializeSocket(this, MockResponsesWebSocket, defaults, events, url, protocols); }
    on(event, listener) { addListener(this, event, listener); return this; }
    once(event, listener) { const once = (...args) => { this.removeListener(event, once); listener(...args); }; return this.on(event, once); }
    off(event, listener) { return this.removeListener(event, listener); }
    removeListener(event, listener) { removeListener(this, event, listener); return this; }
    emit(event, ...args) { emit(this, event, ...args); return this; }
    send(data) { return sendMessage(this, data, defaults); }
    push(...messages) { return pushMessages(this, messages); }
    error(error = new Error('mock socket error')) { this.emit('error', error); return this; }
    close(code = 1000, reason = 'OK') { return closeSocket(this, code, reason); }
  };
}

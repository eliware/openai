import { closeSocket, emitSocketError } from "../lifecycle.mjs";
import { sendMessage, pushMessages } from "../messages.mjs";

export function createMockSocketOperations(defaults) {
  return {
    send(data) {
      return sendMessage(this, data, defaults);
    },
    push(...messages) {
      return pushMessages(this, messages);
    },
    error(error = new Error("mock socket error")) {
      return emitSocketError(this, error);
    },
    close(code = 1000, reason = "OK") {
      return closeSocket(this, code, reason);
    },
  };
}

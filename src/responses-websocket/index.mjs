import { InjectableResponsesWS } from "./socket.mjs";
import { initializeState } from "./api/state.mjs";
import { attachMethods } from "./api/methods.mjs";

export class ResponsesWebSocketAdapter {
  constructor(client, options = {}, httpResponses = client.responses) {
    const { logger, ...socketOptions } = options;
    this.logger = logger;
    this.socket = new InjectableResponsesWS(client, socketOptions);
    initializeState(this, httpResponses);
    attachMethods(this);
  }
}

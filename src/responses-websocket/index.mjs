import { InjectableResponsesWS } from './socket.mjs';
import { initializeState } from './api/state.mjs';
import { attachMethods } from './api/methods.mjs';

export class ResponsesWebSocketAdapter {
  constructor(client, options = {}, httpResponses = client.responses) {
    this.socket = new InjectableResponsesWS(client, options);
    initializeState(this, httpResponses);
    attachMethods(this);
  }
}

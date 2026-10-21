import { getResponsesWebSocketResource } from "../transports/responses-websocket.mjs";
import { createSocketConnection } from "./socket/connection.mjs";
import {
  prepareSocketConfiguration,
  consumeSocketConfiguration,
} from "./socket/configuration/handoff.mjs";

const ResponsesWS = getResponsesWebSocketResource();

export class InjectableResponsesWS extends ResponsesWS {
  constructor(client, options) {
    prepareSocketConfiguration(client, options);
    super(client, options);
    const configuration = consumeSocketConfiguration(client, options);
    this._customWebSocket = configuration.implementation;
    this._customURL = configuration.url;
  }
  // Injected sockets use the 2.0 runtime contract. They use Node-style options.
  // The options include `{ headers }`. The browser constructor is unsupported.
  // The public contract also requires Node-style options for `WebSocketImpl`.
  // Browser constructors cannot receive the required authorization header.
  _createSocket(url, authHeaders) {
    return createSocketConnection(
      this._client,
      { url: this._customURL, implementation: this._customWebSocket },
      url,
      authHeaders,
      () => super._createSocket(url, authHeaders),
    );
  }
}

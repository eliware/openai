import { getResponsesWebSocketResource } from "../transports/responses-websocket.mjs";
import { defaultSocket } from "./socket/factory.mjs";
import { prepareClient, consumeClientConfiguration } from "./socket/configuration.mjs";
import { resolveSocketConfiguration } from "./socket/configuration/resolve.mjs";

const ResponsesWS = getResponsesWebSocketResource();

export class InjectableResponsesWS extends ResponsesWS {
  constructor(client, options) {
    prepareClient(client, options.url, options.WebSocketImpl);
    super(client, options);
    const prepared = consumeClientConfiguration(client);
    this._customWebSocket = prepared.implementation ?? options.WebSocketImpl;
    this._customURL = prepared.url ?? options.url;
  }
  // Injected sockets use the 2.0 runtime contract. They use Node-style options.
  // The options include `{ headers }`. The browser constructor is unsupported.
  // The public contract also requires Node-style options for `WebSocketImpl`.
  // Browser constructors cannot receive the required authorization header.
  _createSocket(url, authHeaders) {
    const configuration = resolveSocketConfiguration(this._client, {
      url: this._customURL,
      implementation: this._customWebSocket,
    });
    if (!configuration.implementation && !configuration.url)
      return super._createSocket(url, authHeaders);
    return defaultSocket(configuration.implementation, configuration.url ?? url, authHeaders);
  }
}

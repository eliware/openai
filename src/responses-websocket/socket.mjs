import { getResponsesWebSocketResource } from "../transports/responses-websocket.mjs";
import { defaultSocket } from "./socket/factory.mjs";
import {
  prepareClient,
  readClientConfiguration,
  consumeClientConfiguration,
} from "./socket/configuration.mjs";

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
    const pending = readClientConfiguration(this._client);
    const customURL = this._customURL ?? pending.url;
    const Impl = this._customWebSocket ?? pending.implementation;
    if (!Impl && !customURL) return super._createSocket(url, authHeaders);
    return defaultSocket(Impl, customURL ?? url, authHeaders);
  }
}

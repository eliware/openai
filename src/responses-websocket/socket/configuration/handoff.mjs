import { consumeClientConfiguration, prepareClient } from "./pending.mjs";

export function prepareSocketConfiguration(client, options) {
  prepareClient(client, options.url, options.WebSocketImpl);
}

export function consumeSocketConfiguration(client, options) {
  const prepared = consumeClientConfiguration(client);
  return {
    implementation: prepared.implementation ?? options.WebSocketImpl,
    url: prepared.url ?? options.url,
  };
}

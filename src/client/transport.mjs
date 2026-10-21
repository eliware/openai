import { createHTTPResponsesAdapter } from "../responses-http/index.mjs";
import { ResponsesWebSocketAdapter } from "../responses-websocket/index.mjs";

export function attachTransport(client, config) {
  const transport = config.transport ?? "http";
  const { transport: _, maxQueueSize, WebSocketImpl, url, logger } = config;
  if (transport === "http") {
    client.responses = createHTTPResponsesAdapter(client.responses, logger);
    return client;
  }
  if (transport !== "websocket") throw new Error(`Unsupported transport: ${transport}`);
  client.responses = new ResponsesWebSocketAdapter(
    client,
    { maxQueueSize, WebSocketImpl, url, logger },
    client.responses,
  );
  return client;
}

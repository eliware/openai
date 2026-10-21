import { createSocket } from "./factory.mjs";
import { resolveSocketConfiguration } from "./configuration/resolution.mjs";

export function createSocketConnection(
  client,
  savedConfiguration,
  url,
  authHeaders,
  createDefault,
) {
  const configuration = resolveSocketConfiguration(client, savedConfiguration);
  if (!configuration.implementation && !configuration.url) return createDefault();
  return createSocket(configuration.implementation, configuration.url ?? url, authHeaders);
}

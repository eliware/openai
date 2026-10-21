import { readClientConfiguration } from "../configuration.mjs";

export function resolveSocketConfiguration(client, savedConfiguration) {
  const pending = readClientConfiguration(client);
  return {
    url: savedConfiguration.url ?? pending.url,
    implementation: savedConfiguration.implementation ?? pending.implementation,
  };
}

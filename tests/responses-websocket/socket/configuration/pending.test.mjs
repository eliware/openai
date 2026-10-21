import {
  prepareClient,
  readClientConfiguration,
  consumeClientConfiguration,
} from "../../../../src/responses-websocket/socket/configuration/pending.mjs";

test("stores, reads, and consumes pending socket configuration", () => {
  const client = {};
  const implementation = function Socket() {};
  prepareClient(client, "ws://test", implementation);
  expect(readClientConfiguration(client)).toEqual({ url: "ws://test", implementation });
  expect(consumeClientConfiguration(client)).toEqual({ url: "ws://test", implementation });
  expect(readClientConfiguration(client)).toEqual({ url: undefined, implementation: undefined });
});

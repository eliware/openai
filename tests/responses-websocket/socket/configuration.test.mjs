import {
  prepareClient,
  readClientConfiguration,
  consumeClientConfiguration,
} from "../../../src/responses-websocket/socket/configuration.mjs";
test("stores and consumes injected socket configuration", () => {
  const client = {};
  const implementation = function Socket() {};
  prepareClient(client, "ws://test", implementation);
  expect(consumeClientConfiguration(client)).toEqual({ url: "ws://test", implementation });
  expect(consumeClientConfiguration(client)).toEqual({});
});

test("reads injected socket configuration before consumption", () => {
  const client = {};
  const implementation = function Socket() {};
  prepareClient(client, "ws://test", implementation);
  expect(readClientConfiguration(client)).toEqual({ url: "ws://test", implementation });
  expect(consumeClientConfiguration(client)).toEqual({ url: "ws://test", implementation });
});

import {
  consumeSocketConfiguration,
  prepareSocketConfiguration,
} from "../../../../src/responses-websocket/socket/configuration/handoff.mjs";

test("hands socket configuration from construction to the WebSocket adapter", () => {
  const client = {};
  const implementation = function Socket() {};
  const options = { url: "ws://custom", WebSocketImpl: implementation };
  prepareSocketConfiguration(client, options);
  expect(consumeSocketConfiguration(client, {})).toEqual({
    url: "ws://custom",
    implementation,
  });
});

test("uses socket options when no pending configuration exists", () => {
  const implementation = function Socket() {};
  expect(
    consumeSocketConfiguration({}, { url: "ws://option", WebSocketImpl: implementation }),
  ).toEqual({ url: "ws://option", implementation });
});

import { resolveSocketConfiguration } from "../../../../src/responses-websocket/socket/configuration/resolution.mjs";
import { prepareClient } from "../../../../src/responses-websocket/socket/configuration/pending.mjs";

test("resolves saved socket options before pending options", () => {
  const client = {};
  const pendingImplementation = function PendingSocket() {};
  const savedImplementation = function SavedSocket() {};
  prepareClient(client, "ws://pending", pendingImplementation);
  expect(
    resolveSocketConfiguration(client, {
      url: "ws://saved",
      implementation: savedImplementation,
    }),
  ).toEqual({ url: "ws://saved", implementation: savedImplementation });
});

test("resolves pending socket options when saved options are absent", () => {
  const client = {};
  const implementation = function Socket() {};
  prepareClient(client, "ws://pending", implementation);
  expect(resolveSocketConfiguration(client, {})).toEqual({
    url: "ws://pending",
    implementation,
  });
});

test("returns empty socket options when no options are pending", () => {
  expect(resolveSocketConfiguration({}, {})).toEqual({});
});

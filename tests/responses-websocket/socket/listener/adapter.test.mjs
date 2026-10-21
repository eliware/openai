import { createNodeSocketListenerAdapter } from "../../../../src/responses-websocket/socket/listener/adapter.mjs";

test("creates listener methods with a registry on the adapter", () => {
  const adapter = { socket: { on() {}, removeListener() {} } };
  const methods = createNodeSocketListenerAdapter(adapter);

  expect(adapter.listeners).toBeDefined();
  expect(methods.on).toEqual(expect.any(Function));
  expect(methods.removeAllListeners).toEqual(expect.any(Function));
});

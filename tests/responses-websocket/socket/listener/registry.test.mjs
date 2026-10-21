import { jest } from "@jest/globals";
import { createListenerRegistry } from "../../../../src/responses-websocket/socket/listener/registry.mjs";
test("registers and removes listeners", () => {
  const raw = { on: jest.fn(), removeListener: jest.fn() };
  const r = createListenerRegistry(raw);
  const fn = () => {};
  r.add("open", fn);
  r.add("message", fn);
  const wrapped = raw.on.mock.calls[1][1];
  r.remove("open", fn);
  r.removeAll();
  r.remove("missing", fn);
  r.removeAll("missing");
  expect(raw.on).toHaveBeenCalled();
  expect(raw.removeListener).toHaveBeenCalled();
  expect(raw.removeListener).toHaveBeenCalledWith("message", wrapped);
});

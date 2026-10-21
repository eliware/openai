import { createInstanceRegistry } from "../../../src/mock-transport/socket/instances.mjs";

test("registers socket instances in its collection", () => {
  const registry = createInstanceRegistry();
  const socket = {};
  expect(registry.register(socket)).toBe(socket);
  expect(registry.instances).toEqual([socket]);
});

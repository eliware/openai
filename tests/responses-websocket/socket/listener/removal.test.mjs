import { jest } from "@jest/globals";
import { removeAllListeners } from "../../../../src/responses-websocket/socket/listener/removal.mjs";
import { createListenerStore } from "../../../../src/responses-websocket/socket/listener/store.mjs";

test("removes listeners for one event", () => {
  const first = jest.fn();
  const second = jest.fn();
  const listeners = createListenerStore();
  listeners.add("open", first, "wrapped-open");
  listeners.add("message", second, "wrapped-message");
  const binding = { remove: jest.fn() };

  removeAllListeners(listeners, binding, "open");

  expect(binding.remove).toHaveBeenCalledWith("open", "wrapped-open");
  expect([...listeners.events()]).toEqual(["message"]);
});

test("removes listeners for every event", () => {
  const listeners = createListenerStore();
  listeners.add("open", jest.fn(), "wrapped-open");
  listeners.add("message", jest.fn(), "wrapped-message");
  const binding = { remove: jest.fn() };

  removeAllListeners(listeners, binding);

  expect(binding.remove).toHaveBeenCalledTimes(2);
  expect([...listeners.events()]).toEqual([]);
});

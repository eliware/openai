import { jest } from "@jest/globals";
import { removeAllListeners } from "../../../../src/responses-websocket/socket/listener/removal.mjs";

test("removes listeners for one event", () => {
  const first = jest.fn();
  const second = jest.fn();
  const listeners = new Map([
    ["open", new Map([[first, "wrapped-open"]])],
    ["message", new Map([[second, "wrapped-message"]])],
  ]);
  const binding = { remove: jest.fn() };

  removeAllListeners(listeners, binding, "open");

  expect(binding.remove).toHaveBeenCalledWith("open", "wrapped-open");
  expect(listeners.has("open")).toBe(false);
  expect(listeners.has("message")).toBe(true);
});

test("removes listeners for every event", () => {
  const listeners = new Map([
    ["open", new Map([[jest.fn(), "wrapped-open"]])],
    ["message", new Map([[jest.fn(), "wrapped-message"]])],
  ]);
  const binding = { remove: jest.fn() };

  removeAllListeners(listeners, binding);

  expect(binding.remove).toHaveBeenCalledTimes(2);
  expect(listeners.size).toBe(0);
});

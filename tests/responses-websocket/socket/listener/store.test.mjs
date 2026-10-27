import { createListenerStore } from "../../../../src/responses-websocket/socket/listener/store.mjs";

test("stores wrapped listeners by event and original listener", () => {
  const store = createListenerStore();
  const listener = () => {};
  const wrapped = () => {};

  store.add("message", listener, wrapped);

  expect(store.get("message", listener)).toBe(wrapped);
  expect([...store.events()]).toEqual(["message"]);
  expect([...store.values("message")]).toEqual([wrapped]);
});

test("removes listeners and clears event storage", () => {
  const store = createListenerStore();
  const listener = () => {};
  store.add("message", listener, () => {});

  store.remove("message", listener);
  expect(store.get("message", listener)).toBeUndefined();

  store.add("message", listener, () => {});
  store.clear("message");
  expect([...store.events()]).toEqual([]);
  expect([...store.values("message")]).toEqual([]);
});

test("retains each wrapper when the same listener is registered more than once", () => {
  const store = createListenerStore();
  const listener = () => {};
  const first = () => {};
  const second = () => {};
  store.add("message", listener, first);
  store.add("message", listener, second);

  expect(store.get("message", listener)).toBe(second);
  store.remove("message", listener);
  expect(store.get("message", listener)).toBe(first);
  expect([...store.values("message")]).toEqual([first]);
});

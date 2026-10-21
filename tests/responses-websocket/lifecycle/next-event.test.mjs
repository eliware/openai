import { jest } from "@jest/globals";
import { waitForNextEvent } from "../../../src/responses-websocket/lifecycle/next-event.mjs";

test("returns the next iterator event", async () => {
  const event = { value: "ready", done: false };
  await expect(waitForNextEvent({ next: async () => event })).resolves.toBe(event);
});

test("rejects when the signal aborts while the iterator waits", async () => {
  const controller = new AbortController();
  let resolveNext;
  const pending = waitForNextEvent(
    { next: () => new Promise((resolve) => (resolveNext = resolve)) },
    controller.signal,
  );
  controller.abort();
  await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  resolveNext({ value: "late", done: false });
  await Promise.resolve();
});

test("rejects before reading an event when the signal is already aborted", async () => {
  const controller = new AbortController();
  controller.abort();
  const next = jest.fn();
  await expect(waitForNextEvent({ next }, controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  });
  expect(next).not.toHaveBeenCalled();
});

test("handles abort while it registers the event listener", async () => {
  const signal = {
    aborted: false,
    addEventListener: (_event, listener) => {
      signal.aborted = true;
      listener();
    },
    removeEventListener: jest.fn(),
  };
  const next = jest.fn();
  await expect(waitForNextEvent({ next }, signal)).rejects.toMatchObject({
    name: "AbortError",
  });
  expect(next).not.toHaveBeenCalled();
});

test("rejects when the iterator fails", async () => {
  const error = new Error("iterator failed");
  const controller = new AbortController();
  await expect(
    waitForNextEvent({ next: () => Promise.reject(error) }, controller.signal),
  ).rejects.toBe(error);
});

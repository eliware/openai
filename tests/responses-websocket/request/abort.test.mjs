import { createAbortController } from "../../../src/responses-websocket/request/abort.mjs";
import { requestEvents } from "../../../src/responses-websocket/request.mjs";

test("cancels an active stream when aborted", async () => {
  const controller = new AbortController();
  let returned = false;
  const sent = [];
  const events = {
    next: () => new Promise(() => {}),
    return: async () => {
      returned = true;
    },
  };
  const abort = createAbortController(
    { isOpen: () => true, socket: { send: (event) => sent.push(event) } },
    events,
    controller.signal,
  );
  controller.signal.addEventListener("abort", abort.onAbort);
  const pending = abort.next();
  controller.abort();
  await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  expect(sent).toEqual([{ type: "response.cancel" }]);
  expect(returned).toBe(true);
  expect(abort.wasAborted()).toBe(true);
});
test("supports no signal, pre-aborted signals, and closed sockets", async () => {
  const events = { next: async () => ({ done: true }), return: async () => {} };
  const noSignal = createAbortController({ isOpen: () => false, socket: { send() {} } }, events);
  await expect(noSignal.next()).resolves.toEqual({ done: true });
  const controller = new AbortController();
  controller.abort();
  const pre = createAbortController(
    { isOpen: () => false, socket: { send() {} } },
    events,
    controller.signal,
  );
  await expect(pre.next()).rejects.toMatchObject({ name: "AbortError" });
  pre.onAbort();
});
test("settles a pending request event read and cancels the active response on abort", async () => {
  let startNext;
  const nextStarted = new Promise((resolve) => {
    startNext = resolve;
  });
  let returned = 0;
  const sent = [];
  const events = {
    next() {
      startNext();
      return new Promise(() => {});
    },
    return() {
      returned += 1;
      return Promise.resolve({ done: true });
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
  const adapter = {
    _activeStreams: new Set(),
    _activeRequest: null,
    ready: async () => {},
    isOpen: () => true,
    socket: {
      stream: () => events,
      send: (event) => sent.push(event),
    },
  };
  const controller = new AbortController();
  const consume = (async () => {
    for await (const event of requestEvents(adapter, {}, { signal: controller.signal })) {
      void event;
    }
  })();

  await nextStarted;
  controller.abort();

  await expect(consume).rejects.toMatchObject({ name: "AbortError" });
  expect(returned).toBeGreaterThan(0);
  expect(adapter._activeStreams.size).toBe(0);
  expect(adapter._activeRequest).toBeNull();
  expect(sent).toEqual([{ type: "response.create" }, { type: "response.cancel" }]);
});

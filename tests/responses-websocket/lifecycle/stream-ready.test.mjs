import { waitForStream } from "../../../src/responses-websocket/lifecycle/stream-ready.mjs";
import { ready } from "../../../src/responses-websocket/lifecycle.mjs";

test("uses the stream when a socket has no listener methods", async () => {
  const adapter = {
    socket: {
      socket: {},
      stream: async function* () {
        yield { type: "open" };
      },
    },
    isOpen: () => false,
  };
  await expect(ready(adapter)).resolves.toBeUndefined();
});

test("waits for stream readiness", async () => {
  const adapter = {
    isOpen: () => false,
    socket: {
      async *stream() {
        yield { type: "message" };
        yield { type: "open" };
      },
    },
  };
  await expect(waitForStream(adapter)).resolves.toBeUndefined();
});

test("accepts an already-open adapter and rejects stream failures", async () => {
  await expect(
    waitForStream({
      isOpen: () => true,
      socket: {
        async *stream() {
          yield { type: "event" };
        },
      },
    }),
  ).resolves.toBeUndefined();
  await expect(
    waitForStream({
      isOpen: () => false,
      socket: {
        async *stream() {
          yield { type: "close" };
        },
      },
    }),
  ).rejects.toThrow("closed before the socket opened");
  await expect(
    waitForStream({ isOpen: () => false, socket: { async *stream() {} } }),
  ).rejects.toThrow("ended before the socket opened");
});

test("returns the readiness iterator after failure", async () => {
  let returned = false;
  const adapter = {
    isOpen: () => false,
    socket: {
      stream: () => ({
        async next() {
          return { value: { type: "error", error: new Error("bad") }, done: false };
        },
        async return() {
          returned = true;
        },
        [Symbol.asyncIterator]() {
          return this;
        },
      }),
    },
  };
  await expect(waitForStream(adapter)).rejects.toThrow("bad");
  expect(returned).toBe(true);
  await expect(
    waitForStream({
      isOpen: () => false,
      socket: {
        async *stream() {
          yield { type: "error" };
        },
      },
    }),
  ).rejects.toThrow("Responses WebSocket error");
});

test("aborts a pending stream readiness wait", async () => {
  let returned = false;
  const controller = new AbortController();
  const adapter = {
    isOpen: () => false,
    socket: {
      stream: () => ({
        next: () => new Promise(() => {}),
        async return() {
          returned = true;
        },
        [Symbol.asyncIterator]() {
          return this;
        },
      }),
    },
  };
  const pending = waitForStream(adapter, controller.signal);
  controller.abort();
  await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  expect(returned).toBe(true);
  const preAborted = new AbortController();
  preAborted.abort();
  await expect(
    waitForStream(
      {
        isOpen: () => false,
        socket: {
          async *stream() {
            yield { type: "open" };
          },
        },
      },
      preAborted.signal,
    ),
  ).rejects.toMatchObject({ name: "AbortError" });
  const active = new AbortController();
  await expect(
    waitForStream(
      {
        isOpen: () => false,
        socket: {
          async *stream() {
            yield { type: "open" };
          },
        },
      },
      active.signal,
    ),
  ).resolves.toBeUndefined();
});

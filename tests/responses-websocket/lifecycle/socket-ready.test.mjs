import { waitForSocket } from "../../../src/responses-websocket/lifecycle/socket-ready.mjs";
import { ready } from "../../../src/responses-websocket/lifecycle.mjs";

test("waits for socket open", async () => {
  const handlers = {};
  const socket = {
    readyState: 0,
    on: (name, fn) => {
      handlers[name] = fn;
    },
    off: () => {},
  };
  const pending = waitForSocket(socket);
  handlers.open();
  await expect(pending).resolves.toBeUndefined();
});

test("waits for an event-capable connecting socket", async () => {
  const handlers = new Map();
  const socket = {
    on: (name, listener) => handlers.set(name, listener),
    off: (name) => handlers.delete(name),
  };
  const pending = waitForSocket(socket);
  handlers.get("open")();
  await expect(pending).resolves.toBeUndefined();
});

test("rejects on socket error and close", async () => {
  for (const event of ["error", "close"]) {
    const handlers = {};
    const socket = {
      readyState: 0,
      on: (name, fn) => {
        handlers[name] = fn;
      },
      off: () => {},
    };
    const pending = waitForSocket(socket);
    if (event === "error") handlers.error(new Error("socket failed"));
    else handlers.close(1000, "closed");
    await expect(pending).rejects.toBeInstanceOf(Error);
  }
});
test("uses the default socket error message", async () => {
  const handlers = {};
  const socket = {
    readyState: 0,
    on: (name, fn) => {
      handlers[name] = fn;
    },
    off: () => {},
  };
  const pending = waitForSocket(socket);
  handlers.error({});
  await expect(pending).rejects.toThrow("Responses WebSocket error");
});

test("rejects immediately for closing sockets and aborted signals", async () => {
  await expect(waitForSocket({ readyState: 2, on() {}, off() {} })).rejects.toThrow(
    "closed before the socket opened",
  );
  const controller = new AbortController();
  controller.abort();
  await expect(
    waitForSocket({ readyState: 0, on() {}, off() {} }, controller.signal),
  ).rejects.toMatchObject({ name: "AbortError" });
});

test("supports sockets without optional listener removal", async () => {
  const handlers = {};
  const socket = {
    readyState: 1,
    on: (name, fn) => {
      handlers[name] = fn;
    },
  };
  await expect(waitForSocket(socket)).resolves.toBeUndefined();
});
test("cleans up a socket without off", async () => {
  const handlers = {};
  const socket = {
    readyState: 0,
    on: (name, fn) => {
      handlers[name] = fn;
    },
  };
  const pending = waitForSocket(socket);
  handlers.open();
  await expect(pending).resolves.toBeUndefined();
});

test("aborts one concurrent readiness wait without cancelling another", async () => {
  const handlers = new Map();
  const socket = {
    readyState: 0,
    on: (name, listener) => handlers.set(name, [...(handlers.get(name) ?? []), listener]),
    off: (name, listener) =>
      handlers.set(
        name,
        (handlers.get(name) ?? []).filter((item) => item !== listener),
      ),
  };
  const adapter = { socket: { socket }, isOpen: () => false };
  const controller = new AbortController();
  const cancelled = ready(adapter, controller.signal);
  const waiting = ready(adapter);
  controller.abort();
  await expect(cancelled).rejects.toMatchObject({ name: "AbortError" });
  for (const listener of handlers.get("open")) listener();
  await expect(waiting).resolves.toBeUndefined();
});

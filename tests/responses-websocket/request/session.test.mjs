import { openRequest } from "../../../src/responses-websocket/request/session.mjs";
import { jest } from "@jest/globals";
test("opens and registers a request session", () => {
  const stream = { next: async () => ({ done: true }), return: async () => {} };
  const adapter = {
    _activeRequest: null,
    _activeStreams: new Set(),
    socket: { stream: () => stream },
  };
  const session = openRequest(adapter, {}, {});
  expect(session.events).toBe(stream);
  expect(adapter._activeStreams.has(stream)).toBe(true);
  expect(adapter._activeRequest).toBe(session.control);
});

test("registers a cancellable signal and rejects pre-aborted requests", () => {
  const stream = { next: async () => ({ done: true }), return: async () => {} };
  const adapter = {
    _activeRequest: null,
    _activeStreams: new Set(),
    socket: { stream: () => stream, send() {} },
    isOpen: () => false,
  };
  const controller = new AbortController();
  const session = openRequest(adapter, {}, { signal: controller.signal });
  expect(session.signal).toBe(controller.signal);
  expect(controller.signal.onabort).toBeNull();
  session.onAbort();

  const aborted = new AbortController();
  aborted.abort(new Error("cancelled"));
  const onError = jest.fn();
  expect(() => openRequest(adapter, {}, { signal: aborted.signal, onError })).toThrow("cancelled");
  expect(onError).toHaveBeenCalledWith(expect.any(Error), { type: "abort" });
});

test("rejects requests while either active-request marker is set", () => {
  const adapter = {
    _activeRequest: { currentResponseId: "active" },
    _activeStreams: new Set(),
    socket: {
      stream: () => {
        throw new Error("must not open");
      },
    },
  };
  expect(() => openRequest(adapter, {}, {})).toThrow("Concurrent Responses WebSocket requests");
  adapter._activeRequest = null;
  adapter._requestActive = true;
  expect(() => openRequest(adapter, {}, {})).toThrow("Concurrent Responses WebSocket requests");
});

import { getStateName } from "../../../src/responses-websocket/api/state-name.mjs";

test("derives names from socket ready states", () => {
  const adapter = { socket: { socket: { readyState: 0 } } };
  expect(getStateName(adapter)).toBe("connecting");
  adapter.socket.socket.readyState = 1;
  expect(getStateName(adapter)).toBe("open");
  adapter.socket.socket.readyState = 2;
  expect(getStateName(adapter)).toBe("closing");
  adapter.socket.socket.readyState = 3;
  expect(getStateName(adapter)).toBe("closed");
  adapter.socket.socket.readyState = 99;
  expect(getStateName(adapter)).toBe("closed");
});

test("reports an active close promise as closing", () => {
  expect(
    getStateName({ _closePromise: Promise.resolve(), _closed: false, socket: { socket: {} } }),
  ).toBe("closing");
  expect(
    getStateName({
      _closePromise: Promise.resolve(),
      _closed: true,
      socket: { socket: { readyState: 1 } },
    }),
  ).toBe("open");
});

test("uses the closed state when the socket state is missing", () => {
  expect(getStateName({ socket: { socket: {} } })).toBe("closed");
  expect(getStateName({ socket: {} })).toBe("closed");
});

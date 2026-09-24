import { jest } from "@jest/globals";
import { continueResponse } from "../../../src/responses-websocket/request/continue-response.mjs";
test("sends matching continuation input", () => {
  const send = jest.fn();
  const adapter = {
    _activeRequest: { waitingForInput: "r", continuationSent: false },
    socket: { send },
  };
  continueResponse(adapter, {
    previous_response_id: "r",
    input: [{ type: "function_call_output", call_id: "c", output: "done" }],
  });
  expect(send).toHaveBeenCalledWith({
    type: "response.create",
    previous_response_id: "r",
    input: [{ type: "function_call_output", call_id: "c", output: "done" }],
  });
  expect(adapter._activeRequest.continuationSent).toBe(true);
});
test("rejects a missing or mismatched pending continuation", () => {
  const adapter = { _activeRequest: { waitingForInput: "r" }, socket: { send: jest.fn() } };
  expect(() => continueResponse(adapter, { previous_response_id: "other" })).toThrow(
    "matching response.steer.pending",
  );
});
test("rejects when no request or no continuation identifier exists", () => {
  expect(() =>
    continueResponse({ _activeRequest: undefined }, { previous_response_id: "r" }),
  ).toThrow("matching response.steer.pending");
  expect(() => continueResponse({ _activeRequest: { waitingForInput: "r" } }, undefined)).toThrow(
    "matching response.steer.pending",
  );
});
test("clears continuation state when send throws", () => {
  const adapter = {
    _activeRequest: { waitingForInput: "r", continuationSent: false },
    socket: {
      send() {
        throw new Error("offline");
      },
    },
  };
  expect(() => continueResponse(adapter, { previous_response_id: "r" })).toThrow("offline");
  expect(adapter._activeRequest.continuationSent).toBe(false);
});
test("uses a stable error message when the socket throws a non-error value", () => {
  const adapter = {
    _activeRequest: { waitingForInput: "r", continuationSent: false },
    socket: {
      send() {
        throw undefined;
      },
    },
  };
  expect(() => continueResponse(adapter, { previous_response_id: "r" })).toThrow(
    "Responses WebSocket continuation failed",
  );
});

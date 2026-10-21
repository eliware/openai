import { jest } from "@jest/globals";
import { emitSocketError } from "../../../src/mock-transport/socket/error.mjs";

test("emits a socket error and returns the socket", () => {
  const socket = { emit: jest.fn() };
  const error = new Error("failed");

  expect(emitSocketError(socket, error)).toBe(socket);
  expect(socket.emit).toHaveBeenCalledWith("error", error);
});

import { ResponsesError } from "../../errors/responses-error.mjs";

export function createCloseTimeoutError() {
  return new ResponsesError("Responses WebSocket close timed out", {
    event: { type: "close", code: "timeout" },
  });
}

import { ResponsesError } from "../../errors/responses-error.mjs";
import { normalizeEvent } from "../../events/normalize.mjs";
import { processEvent } from "./terminal.mjs";
import { readRequestEvent } from "./read.mjs";
import { createRequestControlState } from "./control/state.mjs";
import { writeLog } from "../../logging.mjs";

export async function* readResponseEvents(
  next,
  callbacks,
  controller,
  signal,
  control = createRequestControlState(),
  logger,
) {
  while (true) {
    const result = await readRequestEvent(next, callbacks, controller.wasAborted, signal);
    if (result.done) break;
    const outcome = processEvent(result.value, callbacks, control);
    if (result.value.type === "message") {
      const eventType = result.value.message?.type;
      writeLog(logger, "verbose", "Responses stream event", {
        operation: "responses.create",
        transport: "websocket",
        eventType: typeof eventType === "string" ? eventType : "unknown",
      });
      if (eventType === "response.completed")
        writeLog(logger, "info", "Responses request completed", {
          operation: "responses.create",
          transport: "websocket",
        });
    } else {
      writeLog(logger, "silly", "Responses transport event", {
        operation: "responses.create",
        transport: "websocket",
        eventType: typeof result.value.type === "string" ? result.value.type : "unknown",
      });
    }
    if (outcome.error) {
      callbacks.onError?.(outcome.error, outcome.error.event);
      throw outcome.error;
    }
    if (outcome.done) {
      yield outcome.message;
      return;
    }
    if (outcome.message) yield outcome.message;
  }
  const error = new ResponsesError("Responses WebSocket ended before the final response", {
    event: { type: "end" },
  });
  callbacks.onError?.(error, normalizeEvent({ type: "end" }));
  throw error;
}

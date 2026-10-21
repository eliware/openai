import { ResponsesError } from "../../errors/responses-error.mjs";
import { normalizeEvent } from "../../events/normalize.mjs";
import { dispatch } from "../../responses-http/callback/dispatch.mjs";
import { createRequestControlState, hasPendingSteer, observeControlEvent } from "./control.mjs";
import { processLifecycleEvent } from "./lifecycle-events.mjs";

export function processEvent(event, callbacks, control = createRequestControlState()) {
  if (event.type === "message") {
    const message = normalizeEvent(event.message, event);
    observeControlEvent(control, message);
    dispatch(message, callbacks);
    if (message.type === "response.completed") {
      if (hasPendingSteer(control, message.response?.id)) {
        control.deferredCompletion = message;
        return { message };
      }
      return { message, done: true };
    }
    if (
      message.type === "response.incomplete" &&
      message.response?.incomplete_details?.reason === "steered" &&
      hasPendingSteer(control, message.response?.id)
    )
      return { message };
    if (
      message.type === "response.steer.failed" &&
      control.deferredCompletion &&
      !hasPendingSteer(control, message.steer?.previous_response_id)
    )
      return { done: true };
    if (message.type === "response.failed")
      return {
        message,
        error: new ResponsesError(message.error?.message ?? "Response failed", {
          event: message,
          cause: message.error,
        }),
      };
    if (message.type === "response.incomplete") return { message, done: true };
    return { message };
  }
  return processLifecycleEvent(event, callbacks);
}

import { ResponsesError } from '../../errors/responses-error.mjs';
import { responsesWebSocketError } from '../../errors/websocket-normalize.mjs';
import { normalizeEvent } from '../../events/normalize.mjs';
import { dispatch } from '../../responses-http/callback-dispatch.mjs';
import { hasPendingSteer, observeControlEvent } from './control-events.mjs';
import { createRequestControlState } from './control-state.mjs';

export function processEvent(event, callbacks, control = createRequestControlState()) {
  if (event.type === 'message') {
    observeControlEvent(control, event.message);
    const message = dispatch(normalizeEvent(event.message, event), callbacks);
    if (message.type === 'response.completed') {
      if (hasPendingSteer(control, message.response?.id)) {
        control.deferredCompletion = message;
        return { message };
      }
      return { message, done: true };
    }
    if (message.type === 'response.incomplete' && message.response?.incomplete_details?.reason === 'steered' && hasPendingSteer(control, message.response?.id)) return { message };
    if (message.type === 'response.steer.failed' && control.deferredCompletion && !hasPendingSteer(control, message.steer?.previous_response_id)) return { done: true };
    if (message.type === 'response.failed') return { message, error: new ResponsesError(message.error?.message ?? 'Response failed', { event: message }) };
    if (message.type === 'response.incomplete') return { message, error: new ResponsesError(message.response?.incomplete_details?.reason ?? 'Response incomplete', { event: message }) };
    return { message };
  }
  if (event.type === 'connecting' || event.type === 'open') { callbacks.onEvent?.(event, event.raw); return {}; }
  if (event.type === 'reconnecting' || event.type === 'reconnected') return { error: responsesWebSocketError(normalizeEvent(event, event), 'Responses WebSocket reconnect interrupted the request') };
  if (event.type === 'error') return { error: responsesWebSocketError(normalizeEvent(event, event), 'Responses WebSocket error') };
  if (event.type === 'close') return { error: responsesWebSocketError(normalizeEvent(event, event), 'Responses WebSocket closed before completion') };
  return {};
}

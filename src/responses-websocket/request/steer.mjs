import { ResponsesError } from '../../errors/responses-error.mjs';

export function steerResponse(adapter, previousResponseId, input) {
  const state = adapter._activeRequest;
  if (!state || !state.responseIds.has(previousResponseId) || state.currentResponseId !== previousResponseId) {
    throw new ResponsesError('Steering requires the current response in an active WebSocket request');
  }
  if (typeof input !== 'string' && (!Array.isArray(input) || input.length === 0)) {
    throw new TypeError('steering input must be a string or a non-empty array');
  }
  state.pendingSteers.add(previousResponseId);
  try {
    adapter.socket.send({ type: 'response.steer', previous_response_id: previousResponseId, input });
  } catch (cause) {
    state.pendingSteers.delete(previousResponseId);
    throw new ResponsesError(cause?.message ?? 'Responses WebSocket steering failed', { event: { type: 'response.steer.failed' }, cause });
  }
}

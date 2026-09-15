import { ResponsesError } from '../../errors/responses-error.mjs';
import { normalizeEvent } from '../../events/normalize.mjs';
import { processEvent } from './terminal.mjs';
import { readRequestEvent } from './read.mjs';

export async function* readResponseEvents(next, callbacks, controller, signal) {
  while (true) {
    const result = await readRequestEvent(next, callbacks, controller.wasAborted, signal);
    if (result.done) break;
    const outcome = processEvent(result.value, callbacks);
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
  const error = new ResponsesError('Responses WebSocket ended before completion', { event: { type: 'end' } });
  callbacks.onError?.(error, normalizeEvent({ type: 'end' }));
  throw error;
}

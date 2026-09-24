import { expect, test } from '@jest/globals';
import { createRequestControlState } from '../../../src/responses-websocket/request/control-state.mjs';
import { hasPendingSteer, observeControlEvent } from '../../../src/responses-websocket/request/control-events.mjs';
test('tracks response creation, steering, failure, and continuation transitions', () => {
  const state = createRequestControlState();
  observeControlEvent(state, { type: 'response.created', response: { id: 'r1' } });
  expect(state.currentResponseId).toBe('r1'); expect(state.responseIds.has('r1')).toBe(true);
  observeControlEvent(state, { type: 'response.created', response: {} });
  observeControlEvent(state, { type: 'response.created', response: { id: 'r1-next', previous_response_id: 'r1' } });
  expect(state.responseIds.has('r1-next')).toBe(true);
  observeControlEvent(state, { type: 'response.steer.accepted', steer: { previous_response_id: 'r1' } });
  expect(hasPendingSteer(state, 'r1')).toBe(true);
  state.deferredCompletion = { response: { id: 'r1' } };
  observeControlEvent(state, { type: 'response.steer.failed', steer: { previous_response_id: 'r1' } });
  expect(hasPendingSteer(state, 'r1')).toBe(false);
  observeControlEvent(state, { type: 'response.steer.pending', steer: { previous_response_id: 'r1' } });
  state.continuationSent = true;
  observeControlEvent(state, { type: 'response.created', response: { id: 'r2', previous_response_id: 'r1' } });
  expect(state.currentResponseId).toBe('r2'); expect(state.waitingForInput).toBeUndefined(); expect(state.deferredCompletion).toBeUndefined();
});

test('handles an unknown event without mutating control state', () => {
  const state = createRequestControlState();
  observeControlEvent(state, { type: 'response.output_text.delta' });
  expect(state.currentResponseId).toBeUndefined();
});

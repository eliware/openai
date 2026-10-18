export function observeControlEvent(state, event) {
  if (event.type === "response.created") {
    const response = event.response;
    state.currentResponseId = response?.id;
    if (response?.id) state.responseIds.add(response.id);
    if (response?.previous_response_id) {
      state.pendingSteers.delete(response.previous_response_id);
      state.acceptedSteers.delete(response.previous_response_id);
      if (state.deferredCompletion?.response?.id === response.previous_response_id)
        state.deferredCompletion = undefined;
    }
    if (state.continuationSent) {
      state.continuationSent = false;
      state.waitingForInput = undefined;
    }
  } else if (event.type === "response.steer.accepted") {
    state.acceptedSteers.add(event.steer.previous_response_id);
  } else if (event.type === "response.steer.failed") {
    const responseId = event.steer.previous_response_id;
    state.pendingSteers.delete(responseId);
    state.acceptedSteers.delete(responseId);
  } else if (event.type === "response.steer.pending") {
    state.waitingForInput = event.steer.previous_response_id;
  }
}

export function hasPendingSteer(state, responseId) {
  return state.pendingSteers.has(responseId) || state.acceptedSteers.has(responseId);
}

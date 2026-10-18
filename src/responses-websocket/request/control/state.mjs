export function createRequestControlState() {
  return {
    currentResponseId: undefined,
    responseIds: new Set(),
    pendingSteers: new Set(),
    acceptedSteers: new Set(),
    waitingForInput: undefined,
    continuationSent: false,
    deferredCompletion: undefined,
  };
}

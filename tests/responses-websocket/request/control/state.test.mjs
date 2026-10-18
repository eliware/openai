import { createRequestControlState } from "../../../../src/responses-websocket/request/control/state.mjs";
test("creates independent response control state", () => {
  const state = createRequestControlState();
  expect(state).toMatchObject({
    currentResponseId: undefined,
    continuationSent: false,
    waitingForInput: undefined,
  });
  expect(state.responseIds).toBeInstanceOf(Set);
  expect(state.pendingSteers).toBeInstanceOf(Set);
  expect(state.acceptedSteers).toBeInstanceOf(Set);
});

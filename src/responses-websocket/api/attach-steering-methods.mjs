import { steerResponse } from "../request/steer.mjs";
import { continueResponse } from "../request/continue-response.mjs";

export function attachSteeringMethods(adapter) {
  adapter.steer = (previousResponseId, input) => steerResponse(adapter, previousResponseId, input);
  adapter.continueResponse = (input) => continueResponse(adapter, input);
  return adapter;
}

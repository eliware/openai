import { jest } from "@jest/globals";
import { attachSteeringMethods } from "../../../../src/responses-websocket/api/attach/steering-methods.mjs";
test("attaches methods that dispatch to the steering operations", () => {
  const adapter = {
    _activeRequest: {
      currentResponseId: "r",
      responseIds: new Set(["r"]),
      pendingSteers: new Set(),
      waitingForInput: "r",
    },
    socket: { send: jest.fn() },
  };
  attachSteeringMethods(adapter);
  adapter.steer("r", "more");
  adapter.continueResponse({ previous_response_id: "r", input: "continued" });
  expect(adapter.socket.send).toHaveBeenNthCalledWith(1, {
    type: "response.steer",
    previous_response_id: "r",
    input: "more",
  });
  expect(adapter.socket.send).toHaveBeenNthCalledWith(2, {
    type: "response.create",
    previous_response_id: "r",
    input: "continued",
  });
});

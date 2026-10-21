import { jest } from "@jest/globals";

const requestEvents = jest.fn();
jest.unstable_mockModule("../../../src/responses-websocket/request.mjs", () => ({ requestEvents }));
const { createResponse } = await import("../../../src/responses-websocket/api/create-response.mjs");

test("rejects creation on a closed adapter", async () => {
  await expect(createResponse({ _closed: true })).rejects.toThrow("closed");
});

test("returns incomplete response data to non-stream consumers", async () => {
  requestEvents.mockReturnValue(
    (async function* () {
      yield { type: "response.incomplete", response: { id: "r1", status: "incomplete" } };
    })(),
  );

  await expect(createResponse({})).resolves.toEqual({ id: "r1", status: "incomplete" });
});

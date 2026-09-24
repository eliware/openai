import { requestEvents } from "../../src/responses-websocket/request.mjs";
import { continueResponse } from "../../src/responses-websocket/request/continue-response.mjs";
import { steerResponse } from "../../src/responses-websocket/request/steer.mjs";

test("coordinates readiness, request sending, event delivery, and cleanup", async () => {
  const sent = [];
  let ready = false;
  const adapter = {
    _activeStreams: new Set(),
    _activeRequest: null,
    ready: async () => {
      ready = true;
    },
    socket: {
      stream: async function* () {
        yield {
          type: "message",
          message: { type: "response.completed", response: { id: "resp_1" } },
        };
      },
      send: (event) => sent.push(event),
    },
    isOpen: () => true,
  };
  const events = [];
  for await (const event of requestEvents(adapter, { model: "gpt-6-luna" })) events.push(event);
  expect(ready).toBe(true);
  expect(sent).toEqual([{ type: "response.create", model: "gpt-6-luna" }]);
  expect(events).toMatchObject([{ type: "response.completed", responseId: "resp_1" }]);
  expect(adapter._activeRequest).toBeNull();
  expect(adapter._activeStreams.size).toBe(0);
});

test("keeps a steered request open for tool continuation until successor completion", async () => {
  const sent = [];
  const messages = [
    { type: "response.created", response: { id: "r1" } },
    { type: "response.steer.accepted", steer: { previous_response_id: "r1" } },
    { type: "response.completed", response: { id: "r1" } },
    {
      type: "response.steer.pending",
      steer: { previous_response_id: "r1" },
      required_input: [{ type: "function_call_output", call_id: "call1" }],
    },
    { type: "response.created", response: { id: "r2", previous_response_id: "r1" } },
    { type: "response.completed", response: { id: "r2" } },
  ];
  const adapter = {
    _activeStreams: new Set(),
    _activeRequest: null,
    socket: {
      stream: async function* () {
        for (const message of messages) yield { type: "message", message };
      },
      send: (event) => sent.push(event),
    },
    ready: async () => {},
    isOpen: () => true,
  };
  const delivered = [];
  const callbacks = {
    onEvent(event) {
      if (event.type === "response.created" && event.response.id === "r1")
        steerResponse(adapter, "r1", "Keep the plan concise.");
      if (event.type === "response.steer.pending")
        continueResponse(adapter, {
          previous_response_id: "r1",
          input: [{ type: "function_call_output", call_id: "call1", output: "complete" }],
        });
    },
  };
  for await (const event of requestEvents(adapter, { model: "gpt-6-astra" }, callbacks))
    delivered.push(event.type);
  expect(delivered).toEqual([
    "response.created",
    "response.steer.accepted",
    "response.completed",
    "response.steer.pending",
    "response.created",
    "response.completed",
  ]);
  expect(sent[0]).toEqual({ type: "response.create", model: "gpt-6-astra" });
  expect(sent.slice(1)).toEqual([
    { type: "response.steer", previous_response_id: "r1", input: "Keep the plan concise." },
    {
      type: "response.create",
      previous_response_id: "r1",
      input: [{ type: "function_call_output", call_id: "call1", output: "complete" }],
    },
  ]);
});

test("reports an abort that occurs while waiting for readiness", async () => {
  const controller = new AbortController();
  const calls = [];
  const adapter = {
    _activeStreams: new Set(),
    _activeRequest: null,
    socket: {
      stream: async function* () {},
      send() {},
    },
    ready: async () => controller.abort(new Error("stopped")),
    isOpen: () => false,
  };
  await expect(
    (async () => {
      for await (const event of requestEvents(
        adapter,
        {},
        {
          signal: controller.signal,
          onError: (error, event) => calls.push([error, event]),
        },
      ))
        void event;
    })(),
  ).rejects.toMatchObject({ message: "stopped" });
  expect(calls[0][1]).toEqual({ type: "abort" });
  expect(adapter._activeRequest).toBeNull();
});

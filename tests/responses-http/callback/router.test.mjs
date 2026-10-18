import { jest } from "@jest/globals";
import { routeCallback } from "../../../src/responses-http/callback/router.mjs";
test("routes protocol callbacks", () => {
  const onTextDelta = jest.fn();
  const event = { type: "response.output_text.delta", delta: "x" };
  expect(routeCallback(event, { onTextDelta })).toBe(event);
  expect(onTextDelta).toHaveBeenCalledWith("x", event);
});
test("routes both completion callback names", () => {
  const handlers = { onCompleted: jest.fn(), onResponseCompleted: jest.fn() };
  const event = { type: "response.completed", response: {} };
  routeCallback(event, handlers);
  expect(handlers.onCompleted).toHaveBeenCalled();
  expect(handlers.onResponseCompleted).toHaveBeenCalled();
});
test("routes response, content-part, text, and item callbacks with normalized events", () => {
  const callbacks = Object.fromEntries(
    [
      "onResponseCreated",
      "onResponseProgress",
      "onContentPartAdded",
      "onContentPartDone",
      "onTextDone",
      "onItemAdded",
      "onItemDone",
    ].map((key) => [key, jest.fn()]),
  );
  const events = [
    ["response.created", "response", "r"],
    ["response.in_progress", "response", "r"],
    ["response.content_part.added", "part", "part"],
    ["response.content_part.done", "part", "part"],
    ["response.output_text.done", "text", "done"],
    ["response.output_item.added", "item", "added"],
    ["response.output_item.done", "item", "done"],
  ];
  for (const [type, field, value] of events) {
    const event = { type, [field]: value };
    routeCallback(event, callbacks);
    const callback = {
      "response.created": "onResponseCreated",
      "response.in_progress": "onResponseProgress",
      "response.content_part.added": "onContentPartAdded",
      "response.content_part.done": "onContentPartDone",
      "response.output_text.done": "onTextDone",
      "response.output_item.added": "onItemAdded",
      "response.output_item.done": "onItemDone",
    }[type];
    expect(callbacks[callback]).toHaveBeenCalledWith(value, event);
  }
});

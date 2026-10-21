import {
  selectEvents,
  selectInitialEvents,
} from "../../../src/mock-transport/socket/event-selection.mjs";

test("selects configured initial events or constructor events", () => {
  const configured = [{ type: "configured" }];
  const fallback = [{ type: "default" }];

  expect(selectInitialEvents(configured, fallback)).toBe(configured);
  expect(selectInitialEvents(() => [], fallback)).toBe(fallback);
});

test("selects generated or configured socket events", () => {
  const configured = [{ type: "configured" }];
  const socket = { _events: configured };
  expect(selectEvents(socket, "payload", {})).toBe(configured);
  const generated = [{ type: "generated" }];
  const events = selectEvents(socket, "payload", {
    events: (data, source) => {
      expect(data).toBe("payload");
      expect(source).toBe(socket);
      return generated;
    },
  });
  expect(events).toBe(generated);
});

test("rejects event factory results that are not arrays", () => {
  expect(() => selectEvents({}, "payload", { events: () => null })).toThrow(
    "Mock transport event factory must return an array",
  );
});

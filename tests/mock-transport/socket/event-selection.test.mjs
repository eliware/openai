import { selectEvents } from "../../../src/mock-transport/socket/event-selection.mjs";

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

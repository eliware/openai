import { expect, test } from '@jest/globals';
import { cancelTimers } from '../../src/mock-transport/scheduler.mjs';

test('cancels scheduled mock timers', () => {
  const timer = setTimeout(() => {}, 1000); const state = { _timers: new Set([timer]) }; cancelTimers(state); expect(state._timers.size).toBe(0);
});

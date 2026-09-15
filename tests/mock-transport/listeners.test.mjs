import { expect, test } from '@jest/globals';
import { addListener, removeListener, emit } from '../../src/mock-transport/listeners.mjs';

test('manages mock listeners', () => {
  const state = { listeners: new Map() }; const seen = []; const fn = value => seen.push(value);
  addListener(state, 'message', fn); emit(state, 'message', 1); removeListener(state, 'message', fn); emit(state, 'message', 2);
  expect(seen).toEqual([1]);
});

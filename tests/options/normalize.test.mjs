import { expect, test } from '@jest/globals';
import { normalizeOptions } from '../../src/options/normalize.mjs';

test('normalizes option inputs', () => {
  expect(normalizeOptions('key')).toEqual({ apiKey: 'key' });
  expect(normalizeOptions({ timeout: 1 })).toEqual({ timeout: 1 });
  expect(normalizeOptions()).toEqual({});
  expect(() => normalizeOptions([])).toThrow(TypeError);
});

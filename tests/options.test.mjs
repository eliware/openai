import { describe, expect, test } from '@jest/globals';
import { normalizeOptions, requireApiKey } from '../src/options.mjs';
describe('options', () => {
  test('normalizes API keys and objects', () => { expect(normalizeOptions('key')).toEqual({ apiKey: 'key' }); expect(normalizeOptions({ timeout: 1 })).toEqual({ timeout: 1 }); expect(normalizeOptions()).toEqual({}); });
  test('validates input and keys', () => { expect(() => normalizeOptions([])).toThrow(TypeError); expect(() => requireApiKey('')).toThrow('required'); expect(() => requireApiKey('key')).not.toThrow(); });
});

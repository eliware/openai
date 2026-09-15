import { expect, test } from '@jest/globals';
import { requireApiKey } from '../../src/options/api-key.mjs';

test('validates API keys', () => {
  expect(() => requireApiKey('')).toThrow('required');
  expect(() => requireApiKey('key')).not.toThrow();
});

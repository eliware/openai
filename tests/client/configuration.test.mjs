import { expect, test } from '@jest/globals';
import { resolveClientConfiguration } from '../../src/client/configuration.mjs';

test('resolves explicit client configuration', () => {
  expect(resolveClientConfiguration({ apiKey: 'key' }, 'OPENAI_API_KEY')).toEqual({ config: { apiKey: 'key' }, apiKey: 'key' });
});

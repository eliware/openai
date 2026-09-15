import { expect, test } from '@jest/globals';
import { HANDLER_KEYS, splitOptions } from '../../src/responses-http/callback-options.mjs';

test('isolates callback options from request options', () => {
  const onEvent = () => {};
  const result = splitOptions({ model: 'gpt-5.6', onEvent });
  expect(HANDLER_KEYS).toContain('onEvent');
  expect(result.handlers.onEvent).toBe(onEvent);
  expect(result.requestOptions).toEqual({ model: 'gpt-5.6' });
});

import { expect, test } from '@jest/globals';
import { splitRequest } from '../../src/responses-http/request-options.mjs';

test('splits HTTP request payload, options, and handlers', () => {
  const onEvent = () => {}; const result = splitRequest({ model: 'gpt-5.6', stream: true, onEvent }, { signal: undefined });
  expect(result.request).toEqual({ model: 'gpt-5.6', stream: true }); expect(result.handlers.onEvent).toBe(onEvent); expect(result.streaming).toBe(true);
});

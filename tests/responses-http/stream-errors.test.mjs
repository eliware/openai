import { expect, jest, test } from '@jest/globals';
import { normalizeStreamError } from '../../src/responses-http/stream-errors.mjs';

test('normalizes and reports stream errors', () => {
  const handlers = { onError: jest.fn() };
  const result = normalizeStreamError(new Error('failed'), handlers);
  expect(result.message).toBe('failed');
  expect(handlers.onError).toHaveBeenCalled();
});

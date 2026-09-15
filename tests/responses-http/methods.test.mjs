import { expect, test } from '@jest/globals';
import { delegateHTTP } from '../../src/responses-http/methods.mjs';

test('delegates an HTTP method', async () => {
  await expect(delegateHTTP({ _responses: { retrieve: async id => id } }, 'retrieve', ['r'])).resolves.toBe('r');
});

import { expect, test } from '@jest/globals';
import { delegateHttp } from '../../../src/responses-websocket/api/http.mjs';

test('delegates an HTTP helper call', async () => {
  const adapter = { httpResponses: { retrieve: async value => value } };
  await expect(delegateHttp(adapter, 'retrieve', ['id'])).resolves.toBe('id');
});

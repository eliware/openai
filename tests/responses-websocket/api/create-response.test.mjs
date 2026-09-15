import { expect, test } from '@jest/globals';
import { createResponse } from '../../../src/responses-websocket/api/create-response.mjs';

test('rejects creation on a closed adapter', async () => {
  await expect(createResponse({ _closed: true })).rejects.toThrow('closed');
});

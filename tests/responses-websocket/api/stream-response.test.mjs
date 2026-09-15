import { expect, test } from '@jest/globals';
import { streamResponse } from '../../../src/responses-websocket/api/stream-response.mjs';

test('returns a streaming request iterator', async () => {
  const adapter = { _closed: true };
  await expect(streamResponse(adapter)).rejects.toThrow('closed');
});
test('preserves a signal supplied in the input', async () => { const controller = new AbortController(); const adapter = { _closed: true }; await expect(streamResponse(adapter, { signal: controller.signal })).rejects.toThrow('closed'); });

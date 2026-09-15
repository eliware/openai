import { expect, test } from '@jest/globals';
import { createWithEvents } from '../../../src/responses-websocket/api/event-response.mjs';

test('delegates event creation', async () => {
  const adapter = { _closed: true };
  await expect(createWithEvents(adapter)).rejects.toThrow('closed');
});

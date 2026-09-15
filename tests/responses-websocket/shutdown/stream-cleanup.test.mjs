import { expect, test } from '@jest/globals';
import { cancelStreams } from '../../../src/responses-websocket/shutdown/stream-cleanup.mjs';

test('cancels every active stream', () => {
  const calls = []; cancelStreams([{ return: () => calls.push(1) }, { return: () => calls.push(2) }]); expect(calls).toEqual([1, 2]);
});

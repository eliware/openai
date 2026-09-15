import { expect, test } from '@jest/globals';
import * as transport from '../../src/transports/responses-websocket.mjs';

test('WebSocket transport module exports its implementation', () => {
  expect(transport).toBeDefined();
});

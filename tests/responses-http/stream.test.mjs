import { expect, test } from '@jest/globals';
import * as stream from '../../src/responses-http/stream.mjs';

test('HTTP stream module exports its implementation', () => {
  expect(stream).toBeDefined();
});

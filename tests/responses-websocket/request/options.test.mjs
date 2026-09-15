import { expect, test } from '@jest/globals';
import { prepareRequest } from '../../../src/responses-websocket/request/options.mjs';

test('prepares request callbacks separately from payload options', () => {
  const onEvent = () => {};
  expect(prepareRequest({ model: 'gpt-5.6', onEvent })).toEqual({ signal: undefined, callbacks: { model: 'gpt-5.6', onEvent } });
});

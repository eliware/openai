import { expect, test } from '@jest/globals';
import { responsesErrorFrom } from '../../src/errors/http-normalize.mjs';

test('normalizes HTTP errors', () => {
  expect(responsesErrorFrom(new Error('bad')).event.type).toBe('error');
});
test('uses nested and event metadata fallbacks', () => {
  const error = { error: { message: 'nested', code: 'ec', type: 'et', status: 400, param: 'p', request_id: 'rq' }, status_code: 401, request_id: 'top' };
  const result = responsesErrorFrom(error, { status: 402, code: 'fc', type: 'ft', param: 'fp', request_id: 'fr' });
  expect(result.event).toMatchObject({ status: 402, code: 'fc', type: 'ft', param: 'fp', request_id: 'top' });
});
test('handles non-object nested errors', () => { expect(responsesErrorFrom({ error: 'bad' }).event.error.message).toBeUndefined(); });
test('normalizes a null error source', () => { expect(responsesErrorFrom(null).message).toBe('Responses request failed'); });

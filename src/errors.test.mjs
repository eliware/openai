import { describe, expect, test } from '@jest/globals';
import { ResponsesError, abortError } from './errors.mjs';

describe('errors', () => {
  test('preserves direct response metadata', () => {
    const error = new ResponsesError('bad', { event: { code: 'x', type: 'error', status: 400, param: 'input', request_id: 'req' }, cause: new Error('cause') });
    expect(error).toMatchObject({ name: 'ResponsesError', code: 'x', type: 'error', status: 400, parameter: 'input', requestId: 'req', message: 'bad' });
    expect(error.cause).toBeInstanceOf(Error);
  });
  test('reads nested error metadata', () => {
    const error = new ResponsesError('bad', { event: { error: { code: 'x', type: 'api_error', status: 500, param: 'input', request_id: 'req' } } });
    expect(error).toMatchObject({ code: 'x', type: 'api_error', status: 500, parameter: 'input', requestId: 'req' });
  });
  test('supports default error options and missing metadata', () => {
    expect(new ResponsesError('bad')).toMatchObject({ name: 'ResponsesError', message: 'bad' });
  });
  test('creates AbortError', () => {
    const controller = new AbortController(); controller.abort();
    expect(abortError(controller.signal).name).toBe('AbortError');
    const reason = new Error('cancelled'); controller.abort(reason);
    expect(abortError({ reason })).toBe(reason);
  });
});

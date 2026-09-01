import { describe, expect, test } from '@jest/globals';
import { ResponsesError, abortError, responsesErrorFrom, responsesWebSocketError } from '../src/errors.mjs';

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
  test('wraps SDK errors and preserves fallback metadata', () => {
    const cause = Object.assign(new Error('sdk failed'), { error: { code: 'nested' }, status_code: 503, request_id: 'req_nested' });
    const error = responsesErrorFrom(cause);
    expect(error).toMatchObject({ name: 'ResponsesError', message: 'sdk failed', code: 'nested', status: 503, requestId: 'req_nested', cause });
    const fallback = responsesErrorFrom(null, { message: 'fallback', request_id: 'req_fallback' });
    expect(fallback).toMatchObject({ message: 'fallback', requestId: 'req_fallback' });
    expect(responsesErrorFrom({}, {})).toMatchObject({ message: 'Responses request failed' });
  });
  test('creates AbortError', () => {
    const controller = new AbortController(); controller.abort();
    expect(abortError(controller.signal).name).toBe('AbortError');
    const reason = new Error('cancelled'); controller.abort(reason);
    expect(abortError({ reason })).toBe(reason);
    expect(abortError().name).toBe('AbortError');
  });
  test('creates AbortError without DOMException and normalizes websocket event forms', () => {
    const original = globalThis.DOMException;
    globalThis.DOMException = undefined;
    try { expect(abortError().name).toBe('AbortError'); } finally { globalThis.DOMException = original; }
    expect(responsesWebSocketError({ type: 'close', code: 1006 }, 'closed').message).toBe('closed');
    expect(responsesWebSocketError(undefined, 'fallback').message).toBe('fallback');
  });
  test('normalizes websocket errors and preserves explicit causes', () => {
    const cause = new Error('cause'); const error = responsesWebSocketError({ error: { message: 'socket', code: 'down' } }, 'fallback', cause);
    expect(error).toMatchObject({ message: 'socket', cause, event: { type: 'error' } });
    expect(responsesWebSocketError({ type: 'error', error: { message: 'typed' } }, 'fallback').message).toBe('typed');
  });
});

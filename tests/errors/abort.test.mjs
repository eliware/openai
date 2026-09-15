import { expect, test } from '@jest/globals';
import { abortError } from '../../src/errors/abort.mjs';
test('creates an abort error', () => { expect(abortError().name).toBe('AbortError'); });
test('preserves an Error abort reason', () => { const reason = new Error('stop'); const controller = new AbortController(); controller.abort(reason); expect(abortError(controller.signal)).toBe(reason); });

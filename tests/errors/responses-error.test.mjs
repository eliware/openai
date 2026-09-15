import { expect, test } from '@jest/globals';
import { ResponsesError } from '../../src/errors/responses-error.mjs';
test('constructs a normalized response error', () => { expect(new ResponsesError('bad', { event: { code: 'x', type: 'error' } })).toMatchObject({ name: 'ResponsesError', code: 'x' }); });

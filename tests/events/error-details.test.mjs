import { expect, test } from '@jest/globals';
import { eventErrorDetails } from '../../src/events/error-details.mjs';
test('extracts error metadata', () => { expect(eventErrorDetails({ error: { code: 'x', request_id: 'q' } })).toEqual({ code: 'x', type: undefined, status: undefined, parameter: undefined, requestId: 'q' }); });

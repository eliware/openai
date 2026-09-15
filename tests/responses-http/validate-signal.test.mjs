import { expect, test } from '@jest/globals';
import { validateSignal } from '../../src/responses-http/validate-signal.mjs';
test('validates abort signals', () => { expect(() => validateSignal({})).toThrow('signal must be an AbortSignal'); expect(() => validateSignal()).not.toThrow(); });

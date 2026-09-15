import { expect, test } from '@jest/globals';
import { validateCallbacks } from '../../src/responses-http/validate-callbacks.mjs';
test('validates callback values', () => { expect(() => validateCallbacks({ onEvent: 1 }, ['onEvent'])).toThrow('onEvent must be a function'); expect(() => validateCallbacks({ onEvent() {} }, ['onEvent'])).not.toThrow(); });

import { expect, test } from '@jest/globals';
import { attachHttpMethods } from '../../../src/responses-websocket/api/attach-http-methods.mjs';
test('attaches HTTP delegation methods', () => { const a = {}; attachHttpMethods(a); expect(Object.keys(a)).toEqual(['retrieve', 'delete', 'cancel', 'parse']); });

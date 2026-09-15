import { expect, test } from '@jest/globals';
import { attachResponseMethods } from '../../../src/responses-websocket/api/attach-response-methods.mjs';
test('attaches response methods', () => { const a = {}; attachResponseMethods(a); expect(a.create).toBeInstanceOf(Function); expect(a.createWithEvents).toBeInstanceOf(Function); expect(a.stream).toBeInstanceOf(Function); });

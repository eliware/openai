import { expect, test } from '@jest/globals';
import { attachEventMethods } from '../../../src/responses-websocket/api/attach-event-methods.mjs';
test('attaches event methods', () => { const a = {}; attachEventMethods(a); expect(a.events).toBeInstanceOf(Function); expect(a._request).toBeInstanceOf(Function); expect(a._handleEvent).toBeInstanceOf(Function); });

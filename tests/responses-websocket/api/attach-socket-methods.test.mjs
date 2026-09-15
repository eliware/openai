import { expect, test } from '@jest/globals';
import { attachSocketMethods } from '../../../src/responses-websocket/api/attach-socket-methods.mjs';
test('attaches socket listener methods', () => { const a = { socket: { on() {}, off() {} } }; attachSocketMethods(a); expect(a.on('x', () => {})).toBe(a); expect(a.off('x', () => {})).toBe(a); });

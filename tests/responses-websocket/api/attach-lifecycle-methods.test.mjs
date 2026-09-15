import { expect, test } from '@jest/globals';
import { attachLifecycleMethods } from '../../../src/responses-websocket/api/attach-lifecycle-methods.mjs';
test('attaches lifecycle methods', () => { const a = { socket: { readyState: 1 } }; attachLifecycleMethods(a); expect(a.ready).toBeInstanceOf(Function); expect(a.isOpen).toBeInstanceOf(Function); expect(a.close).toBeInstanceOf(Function); expect(a.state).toBeDefined(); });

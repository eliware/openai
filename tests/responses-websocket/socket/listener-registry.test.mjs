import { expect, jest, test } from '@jest/globals';
import { createListenerRegistry } from '../../../src/responses-websocket/socket/listener-registry.mjs';
test('registers and removes listeners', () => { const raw = { on: jest.fn(), removeListener: jest.fn() }; const r = createListenerRegistry(raw); const fn = () => {}; r.add('open', fn); r.remove('open', fn); r.removeAll(); expect(raw.on).toHaveBeenCalled(); expect(raw.removeListener).toHaveBeenCalled(); });

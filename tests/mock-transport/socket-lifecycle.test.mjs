import { expect, test } from '@jest/globals';
import { closeSocket } from '../../src/mock-transport/socket-lifecycle.mjs';
test('closes a mock socket', () => { const socket = { readyState: 1, _timers: new Set(), emit: () => {} }; closeSocket(socket, 1000, 'OK'); expect(socket.readyState).toBe(3); });

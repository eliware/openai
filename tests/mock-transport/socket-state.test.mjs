import { expect, test } from '@jest/globals';
import { initializeSocket } from '../../src/mock-transport/socket-state.mjs';
test('initializes mock socket state', () => { const MockSocket = { instances: [] }; const socket = { emit: () => {} }; initializeSocket(socket, MockSocket, { autoOpen: false, events: [] }, [], 'url', 'proto'); expect(socket.url).toBe('url'); expect(MockSocket.instances).toContain(socket); });

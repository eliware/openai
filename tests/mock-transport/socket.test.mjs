import { expect, test } from '@jest/globals';
import { createMockSocketClass } from '../../src/mock-transport/socket.mjs';
test('creates an isolated mock socket class', () => { const Socket = createMockSocketClass([{ type: 'response.completed' }], { autoOpen: false }); const socket = new Socket('ws://test'); expect(socket.readyState).toBe(0); expect(Socket.instances).toHaveLength(1); socket.push({ type: 'event' }); expect(socket.sent).toEqual([]); socket.close(); expect(socket.readyState).toBe(3); });

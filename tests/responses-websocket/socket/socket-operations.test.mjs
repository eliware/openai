import { expect, jest, test } from '@jest/globals';
import { createSocketOperations } from '../../../src/responses-websocket/socket/socket-operations.mjs';
test('adapts socket operations', () => { const raw = { send: jest.fn(), close: jest.fn(), terminate: jest.fn(() => 'done') }; const ops = createSocketOperations(raw); ops.send('x'); ops.close(1000, 3); expect(raw.close).toHaveBeenCalledWith(1000, '3'); expect(ops.terminate()).toBe('done'); });

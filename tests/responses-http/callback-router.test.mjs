import { expect, jest, test } from '@jest/globals';
import { routeCallback } from '../../src/responses-http/callback-router.mjs';
test('routes protocol callbacks', () => { const onTextDelta = jest.fn(); const event = { type: 'response.output_text.delta', delta: 'x' }; expect(routeCallback(event, { onTextDelta })).toBe(event); expect(onTextDelta).toHaveBeenCalledWith('x', event); });
test('routes both completion callback names', () => { const handlers = { onCompleted: jest.fn(), onResponseCompleted: jest.fn() }; const event = { type: 'response.completed', response: {} }; routeCallback(event, handlers); expect(handlers.onCompleted).toHaveBeenCalled(); expect(handlers.onResponseCompleted).toHaveBeenCalled(); });

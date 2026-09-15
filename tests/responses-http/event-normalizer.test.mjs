import { expect, test } from '@jest/globals';
import { normalizeCallbackEvent } from '../../src/responses-http/event-normalizer.mjs';
test('normalizes callback events', () => { const raw = { type: 'response.created', response: { id: 'r' } }; expect(normalizeCallbackEvent(raw).type).toBe('response.created'); });

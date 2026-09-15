import { expect, test } from '@jest/globals';
import { handleResponseEvent } from '../../../src/responses-websocket/api/lifecycle-api.mjs';
test('delegates response event handling', () => { expect(handleResponseEvent({ type: 'other' }, {})).toMatchObject({ type: 'other' }); });

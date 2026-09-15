import { expect, test } from '@jest/globals';
import { prepareClient, consumeClientConfiguration } from '../../../src/responses-websocket/socket/configuration.mjs';
test('stores and consumes injected socket configuration', () => { const client = {}; const implementation = function Socket() {}; prepareClient(client, 'ws://test', implementation); expect(consumeClientConfiguration(client)).toEqual({ url: 'ws://test', implementation }); expect(consumeClientConfiguration(client)).toEqual({}); });

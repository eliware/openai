import { expect, test } from '@jest/globals';
import { pushMessages } from '../../src/mock-transport/socket-messages.mjs';
test('pushes messages into an open socket', () => { const values = []; pushMessages({ readyState: 1, emit: (...args) => values.push(args) }, [{ type: 'x' }]); expect(values).toHaveLength(1); });

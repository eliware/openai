import { expect, test, jest } from '@jest/globals';
import { completeHTTP } from '../../src/responses-http/completion.mjs';

test('dispatches synthetic HTTP completion', async () => {
  const onCompleted = jest.fn(); await expect(completeHTTP(Promise.resolve({ id: 'r' }), { onCompleted })).resolves.toEqual({ id: 'r' }); expect(onCompleted).toHaveBeenCalled();
});

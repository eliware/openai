import { expect, test, jest } from '@jest/globals';
import { dispatch } from '../../src/responses-http/callback-dispatch.mjs';

test('dispatches a completed event', () => {
  const onCompleted = jest.fn();
  const event = dispatch({ type: 'response.completed', response: { id: 'r' } }, { onCompleted });
  expect(event.type).toBe('response.completed');
  expect(onCompleted).toHaveBeenCalled();
});

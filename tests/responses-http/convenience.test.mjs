import { expect, test, jest } from '@jest/globals';
import { createHTTPConvenience } from '../../src/responses-http/convenience.mjs';

test('creates convenience HTTP methods', async () => {
  const adapter = { create: jest.fn().mockResolvedValue(undefined) };
  const responses = { stream: jest.fn().mockReturnValue((async function* () { yield { type: 'x' }; })()) };
  const methods = createHTTPConvenience(adapter, responses);
  await methods.createWithEvents({});
  methods.events({ model: 'gpt-5.6' });
  const values = [];
  for await (const value of methods.stream({ model: 'gpt-5.6' })) values.push(value);
  expect(values).toHaveLength(1);
  expect(adapter.create).toHaveBeenCalled();
  expect(responses.stream).toHaveBeenCalled();
});

import { expect, test, jest } from '@jest/globals';
import { createHTTPCreate } from '../../src/responses-http/create.mjs';

test('creates non-streaming and streaming HTTP responses', async () => {
  const responses = { create: jest.fn().mockResolvedValue({ output: [] }) };
  const create = createHTTPCreate(responses);
  await expect(create({ model: 'gpt-5.6' })).resolves.toEqual({ output: [] });
  expect(responses.create).toHaveBeenCalled();
});

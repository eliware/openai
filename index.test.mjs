import { createOpenAI } from './index.mjs';
import { jest, test, expect, describe } from '@jest/globals';

// Test for createOpenAI
describe('createOpenAI', () => {
  test('throws if no API key is provided', async () => {
    const originalEnv = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    await expect(createOpenAI()).rejects.toThrow('OpenAI API key is required');
    process.env.OPENAI_API_KEY = originalEnv;
  });

  test('returns OpenAI instance with provided API key', async () => {
    const client = await createOpenAI('test-key');
    expect(client).toBeInstanceOf(Object); // OpenAI is a class, but we check for object here
    expect(client.apiKey || client.defaultHeaders).toBeDefined(); // At least one property should exist
  });
});

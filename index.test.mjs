import { createOpenAI, createAzureOpenAI } from './index.mjs';
import { test, expect, describe, afterEach } from '@jest/globals';

afterEach(() => { delete process.env.OPENAI_API_KEY; delete process.env.AZURE_OPENAI_API_KEY; delete process.env.AZURE_OPENAI_ENDPOINT; delete process.env.OPENAI_API_VERSION; });

describe('createOpenAI', () => {
  test('throws if no API key is provided', () => expect(() => createOpenAI()).toThrow('OpenAI API key is required'));
  test('returns client with provided API key', () => expect(createOpenAI('test-key').apiKey).toBe('test-key'));
  test('accepts full SDK options and environment key', () => {
    process.env.OPENAI_API_KEY = 'env-key';
    const client = createOpenAI({ baseURL: 'https://example.test', timeout: 1234, maxRetries: 2 });
    expect(client.apiKey).toBe('env-key');
    expect(client.baseURL).toBe('https://example.test');
  });
  test('validates options and blank keys', () => {
    expect(() => createOpenAI(123)).toThrow('options');
    expect(() => createOpenAI({ apiKey: '  ' })).toThrow('API key');
    expect(() => createOpenAI({ apiKey: 'key', organization: 'org', project: 'proj' })).not.toThrow();
  });
});

describe('createAzureOpenAI', () => {
  test('creates an Azure client from options', () => {
    const client = createAzureOpenAI({ apiKey: 'key', endpoint: 'https://azure.test', apiVersion: '2024-10-21', deployment: 'gpt' });
    expect(client).toBeInstanceOf(Object);
  });
  test('uses environment configuration', () => {
    process.env.AZURE_OPENAI_API_KEY = 'key'; process.env.AZURE_OPENAI_ENDPOINT = 'https://azure.test'; process.env.OPENAI_API_VERSION = '2024-10-21';
    expect(createAzureOpenAI()).toBeInstanceOf(Object);
  });
  test('validates Azure configuration', () => {
    expect(() => createAzureOpenAI({ apiKey: 'key', apiVersion: 'v' })).toThrow('endpoint');
    expect(() => createAzureOpenAI({ apiKey: 'key', endpoint: 'x' })).toThrow('API version');
    expect(() => createAzureOpenAI({ endpoint: 'x', apiVersion: 'v' })).toThrow('API key');
  });
});

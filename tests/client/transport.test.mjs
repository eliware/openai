import { expect, test, jest } from '@jest/globals';
import { attachTransport } from '../../src/client/transport.mjs';

test('rejects unsupported transports', () => {
  expect(() => attachTransport({ responses: {} }, { transport: 'other' })).toThrow('Unsupported transport');
});

test('attaches the HTTP transport', () => {
  const client = { responses: { create: jest.fn() } };
  expect(attachTransport(client, { transport: 'http' })).toBe(client);
  expect(client.responses).not.toBeUndefined();
});

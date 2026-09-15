import { expect, test } from '@jest/globals';
import { readResponseEvents } from '../../../src/responses-websocket/request/loop.mjs';

async function collect(iterator) { const values = []; for await (const value of iterator) values.push(value); return values; }

test('yields terminal messages', async () => {
    const next = async () => ({ value: { type: 'message', message: { type: 'response.completed', response: { id: 'r' } } }, done: false });
    await expect(collect(readResponseEvents(next, {}, {}, undefined))).resolves.toMatchObject([{ response: { id: 'r' }, responseId: 'r', type: 'response.completed' }]);
});

test('fails when the stream ends first', async () => {
    const next = async () => ({ done: true });
    await expect(collect(readResponseEvents(next, {}, {}, undefined))).rejects.toThrow('ended before completion');
});
test('skips non-terminal events and reports callback errors', async () => {
  let index = 0; const values = [{ value: { type: 'connecting' }, done: false }, { done: true }]; const onError = () => {};
  await expect(collect(readResponseEvents(async () => values[index++], { onError }, { wasAborted: () => false }, undefined))).rejects.toThrow('ended before completion');
});
test('yields ordinary messages and reports terminal errors', async () => {
  let index = 0; const values = [
    { value: { type: 'message', message: { type: 'response.output_text.delta', delta: 'x' } }, done: false },
    { value: { type: 'message', message: { type: 'response.failed', error: { message: 'bad' } } }, done: false },
  ]; const onError = () => {};
  await expect(collect(readResponseEvents(async () => values[index++], { onError }, { wasAborted: () => false }, undefined))).rejects.toThrow('bad');
});
test('handles terminal errors without an error callback', async () => {
  const next = async () => ({ value: { type: 'message', message: { type: 'response.failed', error: { message: 'bad' } } }, done: false });
  await expect(collect(readResponseEvents(next, {}, { wasAborted: () => false }, undefined))).rejects.toThrow('bad');
});

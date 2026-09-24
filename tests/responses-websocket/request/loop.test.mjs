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
test('keeps the iterator open through steered incomplete and successor completion', async () => {
  let index = 0;
  const values = [
    { value: { type: 'message', message: { type: 'response.created', response: { id: 'r1' } } }, done: false },
    { value: { type: 'message', message: { type: 'response.steer.accepted', steer: { previous_response_id: 'r1' } } }, done: false },
    { value: { type: 'message', message: { type: 'response.incomplete', response: { id: 'r1', incomplete_details: { reason: 'steered' } } } }, done: false },
    { value: { type: 'message', message: { type: 'response.created', response: { id: 'r2', previous_response_id: 'r1' } } }, done: false },
    { value: { type: 'message', message: { type: 'response.completed', response: { id: 'r2' } } }, done: false },
  ];
  const control = { currentResponseId: undefined, responseIds: new Set(), pendingSteers: new Set(['r1']), acceptedSteers: new Set(), waitingForInput: undefined, continuationSent: false, deferredCompletion: undefined };
  await expect(collect(readResponseEvents(async () => values[index++], {}, { wasAborted: () => false }, undefined, control))).resolves.toHaveLength(5);
});
test('waits for steering resolution after a completed response and closes when rejected', async () => {
  let index = 0;
  const values = [
    { value: { type: 'message', message: { type: 'response.created', response: { id: 'r1' } } }, done: false },
    { value: { type: 'message', message: { type: 'response.completed', response: { id: 'r1' } } }, done: false },
    { value: { type: 'message', message: { type: 'response.steer.failed', steer: { previous_response_id: 'r1' }, error: { code: 'response_already_completed' } } }, done: false },
  ];
  const control = { currentResponseId: undefined, responseIds: new Set(), pendingSteers: new Set(['r1']), acceptedSteers: new Set(), waitingForInput: undefined, continuationSent: false, deferredCompletion: undefined };
  await expect(collect(readResponseEvents(async () => values[index++], {}, { wasAborted: () => false }, undefined, control))).resolves.toMatchObject([{ type: 'response.created' }, { type: 'response.completed' }]);
});

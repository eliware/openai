import { ResponsesError } from '../../errors/responses-error.mjs';

export async function waitForStream(adapter) {
  const events = adapter.socket.stream();
  try {
    for await (const event of events) {
      if (event.type === 'open' || adapter.isOpen()) return;
      if (event.type === 'error') throw new ResponsesError(event.error?.message ?? 'Responses WebSocket error', { event, cause: event.error });
      if (event.type === 'close') throw new ResponsesError('Responses WebSocket closed before becoming ready', { event });
    }
    throw new ResponsesError('Responses WebSocket ended before becoming ready');
  } finally { await events.return?.(); }
}

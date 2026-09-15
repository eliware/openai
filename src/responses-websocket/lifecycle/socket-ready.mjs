import { ResponsesError } from '../../errors/responses-error.mjs';
import { abortError } from '../../errors/abort.mjs';

export function waitForSocket(socket, signal) {
  return new Promise((resolve, reject) => {
    const onAbort = () => { cleanup(); reject(abortError(signal)); };
    const onOpen = () => { cleanup(); resolve(); };
    const onError = error => { cleanup(); reject(new ResponsesError(error?.message ?? 'Responses WebSocket error', { event: { type: 'error', error }, cause: error })); };
    const onClose = (code, reason) => { cleanup(); reject(new ResponsesError('Responses WebSocket closed before becoming ready', { event: { type: 'close', code, reason } })); };
    const cleanup = () => { signal?.removeEventListener('abort', onAbort); socket.off?.('open', onOpen); socket.off?.('error', onError); socket.off?.('close', onClose); };
    signal?.addEventListener('abort', onAbort, { once: true });
    if (signal?.aborted) return onAbort();
    socket.on?.('open', onOpen); socket.on?.('error', onError); socket.on?.('close', onClose);
    if (socket.readyState === 1) onOpen();
    else if (socket.readyState === 2 || socket.readyState === 3) onClose();
  });
}

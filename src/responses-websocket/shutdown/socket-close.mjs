import { ResponsesError } from '../../errors/responses-error.mjs';

export function closeSocket(adapter, socket, socketProps, timeout, onComplete) {
  if (!socket || socket.readyState === 3 || typeof adapter.socket.close !== 'function') { onComplete(); return; }
  let settled = false;
  const timer = setTimeout(() => { try { socket.terminate?.(); } catch {} onComplete(new ResponsesError('Responses WebSocket close timed out', { event: { type: 'close', code: 'timeout' } })); }, Math.max(0, timeout));
  const cleanup = () => { clearTimeout(timer); socket.off?.('close', onClose); socket.off?.('error', onError); };
  const done = error => { if (settled) return; settled = true; cleanup(); onComplete(error); };
  const onClose = () => done();
  const onError = error => done(error);
  socket.once?.('close', onClose); socket.once?.('error', onError);
  try {
    adapter.socket.close(socketProps);
    if (socket.readyState === 3 || socket.socket?.closed === true || (!socket.once && !socket.addEventListener)) done();
  } catch (error) { done(error); }
}

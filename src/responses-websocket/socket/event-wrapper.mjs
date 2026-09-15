export function wrapSocketListener(event, listener) {
  if (event === 'message') return (data, binary) => listener(typeof data === 'string' ? data : data.toString(), binary);
  if (event === 'close') return (code, reason) => listener(code, reason?.toString?.() ?? reason);
  return listener;
}

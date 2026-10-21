export function reuseClosePromise(adapter, startClose) {
  if (adapter._closePromise) return adapter._closePromise;
  if (adapter._closed) return Promise.resolve();

  adapter._closePromise = startClose();
  adapter._closePromise.catch(() => {
    adapter._closePromise = null;
  });
  return adapter._closePromise;
}

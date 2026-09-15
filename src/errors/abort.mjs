export function abortError(signal) { if (signal?.reason instanceof Error) return signal.reason; return new DOMException('The operation was aborted', 'AbortError'); }

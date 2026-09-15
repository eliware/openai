export function validateSignal(signal) {
  if (signal !== undefined && (typeof signal !== 'object' || typeof signal.addEventListener !== 'function' || typeof signal.removeEventListener !== 'function')) {
    throw new TypeError('signal must be an AbortSignal');
  }
}

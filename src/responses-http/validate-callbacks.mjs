export function validateCallbacks(options, keys) {
  for (const key of keys) {
    if (key !== 'signal' && options[key] !== undefined && typeof options[key] !== 'function') {
      throw new TypeError(`${key} must be a function`);
    }
  }
}

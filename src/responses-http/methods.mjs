export function delegateHTTP(adapter, method, args) { return adapter._responses[method](...args); }

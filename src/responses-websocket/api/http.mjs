export function delegateHttp(adapter, method, args) {
  return adapter.httpResponses[method](...args);
}

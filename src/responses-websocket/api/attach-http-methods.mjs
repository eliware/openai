import { delegateHttp } from './http.mjs';

export function attachHttpMethods(adapter) {
  for (const method of ['retrieve', 'delete', 'cancel', 'parse']) {
    adapter[method] = (...args) => delegateHttp(adapter, method, args);
  }
  return adapter;
}

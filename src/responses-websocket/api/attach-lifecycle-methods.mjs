import { ready } from '../lifecycle.mjs';
import { close } from '../shutdown.mjs';
import { isOpen, state } from './state.mjs';

export function attachLifecycleMethods(adapter) {
  adapter.ready = signal => ready(adapter, signal);
  adapter.isOpen = () => isOpen(adapter);
  Object.defineProperty(adapter, 'state', { get: () => state(adapter) });
  adapter.close = (options = {}) => close(adapter, options);
  return adapter;
}

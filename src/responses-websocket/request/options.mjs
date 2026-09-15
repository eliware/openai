import { splitOptions } from '../../responses-http/callback-options.mjs';

export function prepareRequest(options) {
  const { handlers, requestOptions } = splitOptions(options);
  const { signal, ...callbacks } = { ...requestOptions, ...handlers };
  return { signal, callbacks };
}

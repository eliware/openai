import { splitOptions } from '../../responses-http/callback-options.mjs';
import { createResponse } from './create-response.mjs';

export function streamResponse(adapter, input = {}, options = {}) {
  const { handlers: inputHandlers, requestOptions: requestInput } = splitOptions(input);
  const { signal: inputSignal, ...request } = requestInput;
  const { handlers: optionHandlers, requestOptions } = splitOptions(options);
  return createResponse(adapter, { ...request, stream: true }, { ...inputHandlers, ...optionHandlers, ...requestOptions, ...(inputSignal === undefined ? {} : { signal: inputSignal }) });
}

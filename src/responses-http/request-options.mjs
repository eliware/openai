import { splitOptions } from './callback-options.mjs';

export function splitRequest(input, options) {
  const { handlers: inputHandlers, requestOptions: requestInput } = splitOptions(input);
  const { handlers: optionHandlers, requestOptions } = splitOptions(options);
  const handlers = { ...inputHandlers, ...optionHandlers };
  const streaming = requestInput.stream ?? requestOptions.stream;
  delete requestInput.stream;
  delete requestOptions.stream;
  const request = { ...requestInput };
  if (streaming !== undefined) request.stream = streaming;
  return { handlers, request, requestOptions, streaming };
}

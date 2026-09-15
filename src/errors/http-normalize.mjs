import { ResponsesError } from './responses-error.mjs';

export function responsesErrorFrom(error, event = {}) {
  const source = error ?? {};
  const normalized = {
    ...event,
    error: {
      ...(source.error && typeof source.error === 'object' ? source.error : {}),
      message: source.message ?? source.error?.message,
      code: source.code ?? source.error?.code,
      type: source.type ?? source.error?.type,
      status: source.status ?? source.status_code ?? source.error?.status,
      param: source.param ?? source.error?.param,
      request_id: source.requestID ?? source.request_id ?? source.error?.request_id,
    },
    status: event.status ?? source.status ?? source.status_code ?? source.error?.status,
    code: event.code ?? source.code ?? source.error?.code,
    type: event.type ?? 'error',
    param: event.param ?? source.param ?? source.error?.param,
    request_id: source.requestID ?? source.request_id ?? event.request_id,
  };
  return new ResponsesError(source.message ?? event.message ?? 'Responses request failed', { event: normalized, cause: error });
}

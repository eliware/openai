export class ResponsesError extends Error {
  constructor(message, { event, cause } = {}) {
    super(message, { cause }); this.name = 'ResponsesError'; this.event = event;
    this.code = event?.code ?? event?.error?.code; this.type = event?.type ?? event?.error?.type;
    this.status = event?.status ?? event?.error?.status; this.parameter = event?.param ?? event?.error?.param;
    this.requestId = event?.request_id ?? event?.error?.request_id;
  }
}
export function abortError(signal) { return signal?.reason instanceof Error ? signal.reason : new DOMException('The operation was aborted', 'AbortError'); }

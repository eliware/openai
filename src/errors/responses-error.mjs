import { eventErrorDetails } from '../events/error-details.mjs';
export class ResponsesError extends Error { constructor(message, { event, cause } = {}) { super(message, { cause }); this.name = 'ResponsesError'; this.event = event; this.cause = cause; Object.assign(this, eventErrorDetails(event)); } }

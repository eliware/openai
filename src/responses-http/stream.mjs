import { normalizeEvent } from '../events.mjs';
import { responsesErrorFrom } from '../errors.mjs';
import { dispatch } from './callbacks.mjs';
export async function* wrapHTTPStream(stream, handlers) { try { for await (const event of await stream) yield dispatch(event, handlers); } catch (error) { const responseError = responsesErrorFrom(error, { type: 'error' }); handlers.onError?.(responseError, normalizeEvent(responseError.event)); throw responseError; } }

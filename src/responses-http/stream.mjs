import { dispatch } from './callback-dispatch.mjs';
import { normalizeStreamError } from './stream-errors.mjs';
export async function* wrapHTTPStream(stream, handlers) { try { for await (const event of await stream) yield dispatch(event, handlers); } catch (error) { throw normalizeStreamError(error, handlers); } }

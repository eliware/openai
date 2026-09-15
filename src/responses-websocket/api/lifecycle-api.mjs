import { dispatch } from '../../responses-http/callback-dispatch.mjs';
import { requestEvents } from '../request.mjs';
export function responseEvents(adapter, response = {}, options = {}) { return requestEvents(adapter, response, options); }
export function handleResponseEvent(event, handlers = {}) { return dispatch(event, handlers); }

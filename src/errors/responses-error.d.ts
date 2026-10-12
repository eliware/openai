import type { ResponsesEvent } from "../events/normalize.mjs";

export declare class ResponsesError extends Error {
  event?: ResponsesEvent;
  code?: string;
  type?: string;
  status?: number;
  parameter?: string;
  requestId?: string;
  cause?: unknown;
}

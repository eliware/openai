import type {
  ResponseSteerAcceptedEvent,
  ResponseSteerFailedEvent,
  ResponseSteerPendingEvent,
  ResponseStreamEvent,
} from "openai/resources/responses/responses";

export interface ResponsesEventMetadata {
  raw?: unknown;
  responseId?: string;
  requestId?: string;
}

export type ResponsesLifecycleEvent =
  | { type: "connecting" | "open" }
  | { type: "close"; code?: number; reason?: string; unsent?: unknown }
  | { type: "error"; error?: unknown };

export type ResponsesEvent =
  | (ResponseStreamEvent & ResponsesEventMetadata)
  | (ResponseSteerAcceptedEvent & ResponsesEventMetadata)
  | (ResponseSteerPendingEvent & ResponsesEventMetadata)
  | (ResponseSteerFailedEvent & ResponsesEventMetadata)
  | (ResponsesLifecycleEvent & ResponsesEventMetadata)
  | (Record<string, unknown> & ResponsesEventMetadata);

export declare function normalizeEvent(event: unknown, raw?: unknown): ResponsesEvent | unknown;

import type OpenAI from "openai";
import type {
  Response,
  ResponseCreateParams,
  ResponseOutputItem,
} from "openai/resources/responses/responses";
import type { ResponsesEvent } from "../events/normalize.mjs";

export type ResponsesRequest = ResponseCreateParams;
export type ResponsesResponse = Response;
export type ResponsesOutputItem = ResponseOutputItem;

export type ResponsesEventHandlerOptions = {
  signal?: AbortSignal;
  onEvent?: (event: ResponsesEvent) => void;
  onResponseCreated?: (response: ResponsesResponse, event: ResponsesEvent) => void;
  onResponseProgress?: (response: ResponsesResponse, event: ResponsesEvent) => void;
  onContentPartAdded?: (part: unknown, event: ResponsesEvent) => void;
  onContentPartDone?: (part: unknown, event: ResponsesEvent) => void;
  onTextDelta?: (delta: string, event: ResponsesEvent) => void;
  onTextDone?: (text: string, event: ResponsesEvent) => void;
  onItemAdded?: (item: ResponsesOutputItem, event: ResponsesEvent) => void;
  onItemDone?: (item: ResponsesOutputItem, event: ResponsesEvent) => void;
  onCompleted?: (response: ResponsesResponse, event: ResponsesEvent) => void;
  onResponseCompleted?: (response: ResponsesResponse, event: ResponsesEvent) => void;
  onError?: (error: Error, event: ResponsesEvent) => void;
};

export type ResponsesRequestOptions = ResponsesEventHandlerOptions & {
  headers?: Record<string, string>;
  timeout?: number;
};

export interface HTTPResponsesEventAPI {
  create(
    input?: ResponsesRequest & { stream?: boolean },
    options?: ResponsesRequestOptions,
  ): Promise<ResponsesResponse> | AsyncIterable<ResponsesEvent>;
  createWithEvents(
    input?: ResponsesRequest & { stream?: boolean },
    handlers?: ResponsesEventHandlerOptions,
  ): Promise<ResponsesResponse | void>;
  events(
    input?: ResponsesRequest,
    options?: ResponsesRequestOptions,
  ): AsyncIterable<ResponsesEvent>;
  stream(
    input?: ResponsesRequest,
    options?: ResponsesRequestOptions,
  ): AsyncIterable<ResponsesEvent>;
}

export declare function createHTTPResponsesAdapter(
  responses: OpenAI["responses"],
): OpenAI["responses"] & HTTPResponsesEventAPI;

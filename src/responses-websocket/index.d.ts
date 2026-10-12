import type OpenAI from "openai";
import type {
  ResponseFunctionToolCall,
  ResponseInputItem,
  ResponseOutputItemDoneEvent,
  ResponseSteerInput,
} from "openai/resources/responses/responses";
import type { ResponsesEvent } from "../events/normalize.mjs";
import type { WebSocketConstructor } from "../mock-transport.mjs";
import type {
  ResponsesEventHandlerOptions,
  ResponsesRequest,
  ResponsesResponse,
} from "../responses-http/index.mjs";

export interface ResponsesWebSocketClientAPI {
  create(
    input?: ResponsesRequest & { stream?: boolean },
    options?: ResponsesEventHandlerOptions,
  ): Promise<ResponsesResponse> | AsyncIterable<ResponsesEvent>;
  createWithEvents(
    input?: ResponsesRequest & { stream?: boolean },
    handlers?: ResponsesEventHandlerOptions,
  ): Promise<ResponsesResponse | void>;
  events(
    input?: ResponsesRequest,
    options?: ResponsesEventHandlerOptions,
  ): AsyncIterable<ResponsesEvent>;
  stream(
    input?: ResponsesRequest,
    options?: ResponsesEventHandlerOptions,
  ): AsyncIterable<ResponsesEvent>;
  steer(previousResponseId: string, input: ResponseSteerInput): void;
  continueResponse(input: ResponsesRequest & { previous_response_id: string }): void;
  inputItems?: OpenAI["responses"]["inputItems"];
  inputTokens?: OpenAI["responses"]["inputTokens"];
  retrieve(...args: unknown[]): Promise<unknown>;
  delete(...args: unknown[]): Promise<unknown>;
  cancel(...args: unknown[]): Promise<unknown>;
  parse(...args: unknown[]): Promise<unknown>;
  ready(signal?: AbortSignal): Promise<void>;
  isOpen(): boolean;
  readonly state: "connecting" | "open" | "closing" | "closed";
  close(options?: { code?: number; reason?: string; timeout?: number }): Promise<void>;
  on(event: string, listener: (...args: unknown[]) => void): this;
  off(event: string, listener: (...args: unknown[]) => void): this;
}

export type ResponsesAsyncFunctionTool =
  import("openai/resources/responses/responses").FunctionTool & {
    async: true;
  };
export type ResponsesAsyncFunctionCall = ResponseFunctionToolCall & { async: true };
export type ResponsesAsyncFunctionCallEvent = Omit<ResponseOutputItemDoneEvent, "item"> & {
  item: ResponsesAsyncFunctionCall;
};
export type ResponsesFunctionCallOutput = ResponseInputItem.FunctionCallOutput & {
  call_id: string;
};

export interface ResponsesWebSocketAdapter extends ResponsesWebSocketClientAPI {}

export declare const ResponsesWebSocketAdapter: {
  new (
    client: OpenAI,
    options?: { maxQueueSize?: number; WebSocketImpl?: WebSocketConstructor; url?: string },
    httpResponses?: OpenAI["responses"],
  ): ResponsesWebSocketAdapter;
};

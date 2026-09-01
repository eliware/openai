import OpenAI, { AzureOpenAI } from 'openai';
import type { ResponsesWSClientOptions } from 'openai/resources/responses/ws';
import type { Response, ResponseCreateParams, ResponseOutputItem, ResponseStreamEvent } from 'openai/resources/responses/responses';

export interface ResponsesEventMetadata {
  raw?: unknown;
  responseId?: string;
  requestId?: string;
}

export type ResponsesLifecycleEvent =
  | { type: 'connecting' | 'open' | 'reconnecting' | 'reconnected' }
  | { type: 'close'; code?: number; reason?: string; unsent?: unknown }
  | { type: 'error'; error?: unknown };

export type ResponsesEvent =
  | (ResponseStreamEvent & ResponsesEventMetadata)
  | (ResponsesLifecycleEvent & ResponsesEventMetadata)
  | (Record<string, unknown> & ResponsesEventMetadata);

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

export declare class ResponsesError extends Error {
  event?: ResponsesEvent; code?: string; type?: string; status?: number; parameter?: string; requestId?: string; cause?: unknown;
}

export declare function eventErrorDetails(event: unknown): { code?: string; type?: string; status?: number; parameter?: string; requestId?: string };

export interface WebSocketConstructor {
  new (url: string | URL, protocols?: unknown): WebSocketLike;
}
export interface WebSocketLike {
  readonly readyState: number;
  send(data: string | ArrayBuffer | Uint8Array): void;
  close(code?: number, reason?: string): void;
  on(event: string, listener: (...args: unknown[]) => void): unknown;
  removeListener?(event: string, listener: (...args: unknown[]) => void): unknown;
}

export type ResponsesRequestOptions = ResponsesEventHandlerOptions & {
  headers?: Record<string, string>;
  timeout?: number;
};

export type Transport = 'http' | 'websocket';
export type OpenAIOptions = ConstructorParameters<typeof OpenAI>[0] & {
  transport?: Transport;
  reconnect?: ResponsesWSClientOptions['reconnect'];
  maxQueueSize?: ResponsesWSClientOptions['maxQueueSize'];
  WebSocketImpl?: WebSocketConstructor;
  url?: string;
};
export type AzureOpenAIOptions = ConstructorParameters<typeof AzureOpenAI>[0] & {
  transport?: Transport;
  reconnect?: ResponsesWSClientOptions['reconnect'];
  maxQueueSize?: ResponsesWSClientOptions['maxQueueSize'];
  WebSocketImpl?: WebSocketConstructor;
  url?: string;
};

export interface ResponsesWebSocketAdapter {
  create(input?: ResponsesRequest, options?: ResponsesEventHandlerOptions): Promise<ResponsesResponse> | AsyncIterable<ResponsesEvent>;
  createWithEvents(input?: ResponsesRequest, handlers?: ResponsesEventHandlerOptions): Promise<ResponsesResponse>;
  events(input?: ResponsesRequest, options?: ResponsesEventHandlerOptions): AsyncIterable<ResponsesEvent>;
  stream(input?: ResponsesRequest, options?: ResponsesEventHandlerOptions): AsyncIterable<ResponsesEvent>;
  inputItems?: OpenAI['responses']['inputItems'];
  inputTokens?: OpenAI['responses']['inputTokens'];
  retrieve(...args: unknown[]): Promise<unknown>;
  delete(...args: unknown[]): Promise<unknown>;
  cancel(...args: unknown[]): Promise<unknown>;
  parse(...args: unknown[]): Promise<unknown>;
  ready(): Promise<void>;
  isOpen(): boolean;
  readonly state: 'connecting' | 'open' | 'closing' | 'closed';
  close(options?: { code?: number; reason?: string; timeout?: number }): Promise<void>;
  on(event: string, listener: (...args: unknown[]) => void): this;
  off(event: string, listener: (...args: unknown[]) => void): this;
}
export interface HTTPResponsesEventAPI {
  create(input?: ResponsesRequest, options?: ResponsesRequestOptions): Promise<ResponsesResponse> | AsyncIterable<ResponsesEvent>;
  createWithEvents(input?: ResponsesRequest, handlers?: ResponsesEventHandlerOptions): Promise<ResponsesResponse>;
  events(input?: ResponsesRequest, options?: ResponsesEventHandlerOptions): AsyncIterable<ResponsesEvent>;
  stream(input?: ResponsesRequest, options?: ResponsesEventHandlerOptions): AsyncIterable<ResponsesEvent>;
}
export type OpenAIClient = OpenAI & { responses: (OpenAI['responses'] & HTTPResponsesEventAPI) | ResponsesWebSocketAdapter };

/** Creates an OpenAI client from an API key or full SDK options. */
export declare function createMockResponsesTransport(events?: unknown[], options?: { autoOpen?: boolean; delay?: number; events?: (data: unknown, socket: WebSocketLike) => unknown[] }): WebSocketConstructor;

export declare function createOpenAI(options?: string | OpenAIOptions): OpenAIClient;
/** Creates an Azure OpenAI client from SDK options or environment variables. */
export declare function createAzureOpenAI(options?: AzureOpenAIOptions): OpenAIClient;

export declare function normalizeEvent(event: unknown, raw?: unknown): ResponsesEvent | unknown;

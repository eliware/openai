import OpenAI, { AzureOpenAI } from 'openai';
import type { ResponsesWSClientOptions } from 'openai/resources/responses/ws';

export interface ResponsesEvent { type?: string; raw?: unknown; responseId?: string; requestId?: string; [key: string]: unknown; }

export type ResponsesEventHandlerOptions = {
  signal?: AbortSignal;
  onEvent?: (event: ResponsesEvent) => void;
  onTextDelta?: (delta: string, event: ResponsesEvent) => void;
  onItemAdded?: (item: unknown, event: ResponsesEvent) => void;
  onItemDone?: (item: unknown, event: ResponsesEvent) => void;
  onCompleted?: (response: unknown, event: ResponsesEvent) => void;
  onError?: (error: ResponsesError, event: ResponsesEvent) => void;
};

export declare class ResponsesError extends Error {
  event?: unknown; code?: string; type?: string; status?: number; parameter?: string; requestId?: string;
}

export type Transport = 'http' | 'websocket' | 'responses-ws';
export type OpenAIOptions = ConstructorParameters<typeof OpenAI>[0] & {
  transport?: Transport;
  reconnect?: ResponsesWSClientOptions['reconnect'];
  maxQueueSize?: ResponsesWSClientOptions['maxQueueSize'];
  WebSocketImpl?: new (...args: any[]) => any;
  url?: string;
};
export type AzureOpenAIOptions = ConstructorParameters<typeof AzureOpenAI>[0] & {
  transport?: Transport;
  reconnect?: ResponsesWSClientOptions['reconnect'];
  maxQueueSize?: ResponsesWSClientOptions['maxQueueSize'];
  WebSocketImpl?: new (...args: any[]) => any;
  url?: string;
};

export interface ResponsesWebSocketAdapter {
  create(input?: Record<string, unknown> & { stream?: boolean }, options?: ResponsesEventHandlerOptions): Promise<unknown> | AsyncIterable<unknown>;
  createWithEvents(input?: Record<string, unknown>, handlers?: Omit<ResponsesEventHandlerOptions, 'signal'> & { signal?: AbortSignal }): Promise<unknown>;
  events(input?: Record<string, unknown>, options?: ResponsesEventHandlerOptions): AsyncIterable<ResponsesEvent>;
  stream(input?: Record<string, unknown>, options?: ResponsesEventHandlerOptions): AsyncIterable<ResponsesEvent>;
  inputItems?: OpenAI['responses']['inputItems'];
  inputTokens?: OpenAI['responses']['inputTokens'];
  retrieve(...args: unknown[]): Promise<unknown>;
  delete(...args: unknown[]): Promise<unknown>;
  cancel(...args: unknown[]): Promise<unknown>;
  parse(...args: unknown[]): Promise<unknown>;
  ready(): Promise<void>;
  isOpen(): boolean;
  readonly state: 'connecting' | 'open' | 'closing' | 'closed';
  close(options?: { code?: number; reason?: string }): Promise<void>;
  on(event: string, listener: (...args: unknown[]) => void): this;
  off(event: string, listener: (...args: unknown[]) => void): this;
}
export type OpenAIClient = OpenAI & { responses: OpenAI['responses'] | ResponsesWebSocketAdapter };

/** Creates an OpenAI client from an API key or full SDK options. */
export declare function createMockResponsesTransport(events?: unknown[]): new (...args: any[]) => any;

export declare function createOpenAI(options?: string | OpenAIOptions): OpenAIClient;
/** Creates an Azure OpenAI client from SDK options or environment variables. */
export declare function createAzureOpenAI(options?: AzureOpenAIOptions): OpenAIClient;

export declare function normalizeEvent(event: unknown, raw?: unknown): ResponsesEvent | unknown;

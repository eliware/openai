import OpenAI from 'openai';
import type { Response, ResponseCreateParams, ResponseOutputItem, ResponseStreamEvent } from 'openai/resources/responses/responses';

export interface ResponsesEventMetadata {
  raw?: unknown;
  responseId?: string;
  requestId?: string;
}

export type ResponsesLifecycleEvent =
  | { type: 'connecting' | 'open' }
  | { type: 'close'; code?: number; reason?: string; unsent?: unknown }
  | { type: 'error'; error?: unknown };

export type ResponsesEvent =
  | (ResponseStreamEvent & ResponsesEventMetadata)
  | (ResponsesLifecycleEvent & ResponsesEventMetadata)
  | (Record<string, unknown> & ResponsesEventMetadata);

export type ResponsesRequest = ResponseCreateParams;
export type ResponsesResponse = Response;
export type ResponsesOutputItem = ResponseOutputItem;

export type GPT56Model = 'gpt-5.6-luna' | 'gpt-5.6-terra' | 'gpt-5.6-sol';

export interface ModelPricing {
  /** USD per million uncached input tokens. */
  input: number;
  /** USD per million cached input tokens. */
  cachedInput: number;
  /** USD per million output tokens. */
  output: number;
  /** Multiplier applied to uncached input pricing for cache writes. */
  cacheWriteMultiplier: number;
}

export declare const API_PRICING: Readonly<Record<GPT56Model, Readonly<ModelPricing>>>;
export declare function getPricing(model: GPT56Model): Readonly<ModelPricing>;
export declare const LONG_CONTEXT_INPUT_THRESHOLD: 272000;
export declare const LONG_CONTEXT_INPUT_MULTIPLIERS: Readonly<{ input: 2; output: 1.5 }>;
export interface NormalizedUsage {
  input: number;
  cachedInput: number;
  cacheWrite: number;
  output: number;
}
export interface ResponsesUsage {
  input_tokens?: number;
  output_tokens?: number;
  input_tokens_details?: { cached_tokens?: number; cache_write_tokens?: number };
}
export declare function normalizeUsage(usage?: ResponsesUsage | null): NormalizedUsage;
export interface PricingBreakdown {
  model: GPT56Model;
  input_tokens: number;
  cached_tokens: number;
  cache_write_tokens: number;
  output_tokens: number;
  long_context: boolean;
  uncached_input_cost_usd: number;
  cached_input_cost_usd: number;
  cache_write_cost_usd: number;
  output_cost_usd: number;
  estimated_cost_usd: number;
}
export declare function calculateUsageCost(model: GPT56Model, usage?: ResponsesUsage | null): number;
export declare function calculateUsageCostBreakdown(model: GPT56Model, usage?: ResponsesUsage | null): PricingBreakdown;
export interface PricingAccumulator {
  add(model: GPT56Model, usage?: ResponsesUsage | null): this;
  summary(): { requests: number; estimated_cost_usd: number; models: Record<GPT56Model, Omit<PricingBreakdown, 'model' | 'long_context' | 'uncached_input_cost_usd' | 'cached_input_cost_usd' | 'cache_write_cost_usd' | 'output_cost_usd'>> };
}
export declare function createPricingAccumulator(): PricingAccumulator;

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
  /** Node-style constructor receiving the URL and `{ headers }` options. */
  new (url: string | URL, options?: { headers?: Record<string, string> }): WebSocketLike;
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
  maxQueueSize?: number;
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

export declare function normalizeEvent(event: unknown, raw?: unknown): ResponsesEvent | unknown;

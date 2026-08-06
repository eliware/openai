import OpenAI, { AzureOpenAI } from 'openai';
import type { ResponsesWSClientOptions } from 'openai/resources/responses/ws';

export type Transport = 'http' | 'websocket' | 'responses-ws';
export type OpenAIOptions = ConstructorParameters<typeof OpenAI>[0] & {
  transport?: Transport;
  reconnect?: ResponsesWSClientOptions['reconnect'];
  maxQueueSize?: ResponsesWSClientOptions['maxQueueSize'];
};
export type AzureOpenAIOptions = ConstructorParameters<typeof AzureOpenAI>[0] & {
  transport?: Transport;
  reconnect?: ResponsesWSClientOptions['reconnect'];
  maxQueueSize?: ResponsesWSClientOptions['maxQueueSize'];
};

export interface ResponsesWebSocketAdapter {
  create(input?: Record<string, unknown> & { stream?: boolean }): Promise<unknown> | AsyncIterable<unknown>;
  stream(input?: Record<string, unknown>, options?: Record<string, unknown>): AsyncIterable<unknown>;
  inputItems?: OpenAI['responses']['inputItems'];
  inputTokens?: OpenAI['responses']['inputTokens'];
  retrieve(...args: unknown[]): Promise<unknown>;
  delete(...args: unknown[]): Promise<unknown>;
  cancel(...args: unknown[]): Promise<unknown>;
  parse(...args: unknown[]): Promise<unknown>;
  close(options?: { code?: number; reason?: string }): void;
  on(event: string, listener: (...args: unknown[]) => void): this;
  off(event: string, listener: (...args: unknown[]) => void): this;
}
export type OpenAIClient = OpenAI & { responses: OpenAI['responses'] | ResponsesWebSocketAdapter };

/** Creates an OpenAI client from an API key or full SDK options. */
export declare function createOpenAI(options?: string | OpenAIOptions): OpenAIClient;
/** Creates an Azure OpenAI client from SDK options or environment variables. */
export declare function createAzureOpenAI(options?: AzureOpenAIOptions): OpenAIClient;

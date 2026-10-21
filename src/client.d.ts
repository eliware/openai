import type OpenAI from "openai";
import type { LoggerWithConfiguredLevels } from "@eliware/log";
import type { HTTPResponsesEventAPI } from "./responses-http/index.mjs";
import type { ResponsesWebSocketClientAPI } from "./responses-websocket/index.mjs";
import type { WebSocketConstructor } from "./mock-transport.mjs";

export type Transport = "http" | "websocket";
export type OpenAILogger = Pick<LoggerWithConfiguredLevels, "log">;
export type OpenAIOptions = ConstructorParameters<typeof OpenAI>[0] & {
  transport?: Transport;
  logger?: OpenAILogger;
  maxQueueSize?: number;
  WebSocketImpl?: WebSocketConstructor;
  url?: string;
};

export type OpenAIHttpClient = OpenAI & {
  responses: OpenAI["responses"] & HTTPResponsesEventAPI;
};
export type OpenAIWebSocketClient = Omit<OpenAI, "responses"> & {
  responses: ResponsesWebSocketClientAPI;
};
export type OpenAIClient = OpenAIHttpClient | OpenAIWebSocketClient;

export declare function createOpenAI(
  options: Partial<OpenAIOptions> & { transport: "websocket" },
): OpenAIWebSocketClient;
export declare function createOpenAI(
  options?: string | (OpenAIOptions & { transport?: "http" }),
): OpenAIHttpClient;
export declare function createOpenAI(options: OpenAIOptions): OpenAIClient;

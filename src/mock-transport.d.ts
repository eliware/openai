export interface WebSocketConstructor {
  new (url: string | URL, options?: { headers?: Record<string, string> }): WebSocketLike;
}

export interface WebSocketLike {
  readonly readyState: number;
  send(data: string | ArrayBuffer | Uint8Array): void;
  close(code?: number, reason?: string): void;
  on(event: string, listener: (...args: unknown[]) => void): unknown;
  removeListener?(event: string, listener: (...args: unknown[]) => void): unknown;
}

export declare function createMockResponsesTransport(
  events?: unknown[],
  options?: {
    autoOpen?: boolean;
    delay?: number;
    events?: (data: unknown, socket: WebSocketLike) => unknown[];
  },
): WebSocketConstructor;

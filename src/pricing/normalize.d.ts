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

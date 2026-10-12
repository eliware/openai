export type PricedModel =
  | "gpt-6-astra"
  | "gpt-6-sol"
  | "gpt-6.1-sol"
  | "gpt-6-luna"
  | "gpt-5.6-luna"
  | "gpt-5.6-terra"
  | "gpt-5.6-sol";

export interface ModelPricing {
  input: number;
  cachedInput: number;
  output: number;
  cacheWriteMultiplier: number;
}

export declare const API_PRICING: Readonly<Record<PricedModel, Readonly<ModelPricing>>>;
export declare function getPricing(model: PricedModel): Readonly<ModelPricing>;

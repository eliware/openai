import OpenAI, { AzureOpenAI } from 'openai';

export type OpenAIOptions = ConstructorParameters<typeof OpenAI>[0];
export type AzureOpenAIOptions = ConstructorParameters<typeof AzureOpenAI>[0];

/** Creates an OpenAI client from an API key or full SDK options. */
export declare function createOpenAI(options?: string | OpenAIOptions): OpenAI;
/** Creates an Azure OpenAI client from SDK options or environment variables. */
export declare function createAzureOpenAI(options?: AzureOpenAIOptions): AzureOpenAI;

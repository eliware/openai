import OpenAI from 'openai';

/**
 * Creates and returns a new OpenAI client.
 * @param apiKey Optional API key. If not provided, uses process.env.OPENAI_API_KEY.
 * @returns A promise that resolves to an OpenAI client instance.
 * @throws If the API key is not provided.
 */
export declare function createOpenAI(apiKey?: string): Promise<OpenAI>;

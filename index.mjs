import OpenAI from 'openai';

/**
 * Creates and returns a new OpenAI client.
 * @param {string} [apiKey] - Optional API key. If not provided, uses process.env.OPENAI_API_KEY.
 * @return {Promise<OpenAI>} - A promise that resolves to an OpenAI client instance.
 * @throws {Error} - Throws an error if the API key is not provided.
 */
export async function createOpenAI(apiKey = process.env.OPENAI_API_KEY) {
  if (!apiKey) throw new Error('OpenAI API key is required');
  return new OpenAI({ apiKey });
}

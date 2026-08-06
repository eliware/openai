import { createOpenAI, createAzureOpenAI } from '@eliware/openai';

// Uses OPENAI_API_KEY, or pass the full SDK options object explicitly.
const openai = createOpenAI({ timeout: 30_000, maxRetries: 3 });
console.log('OpenAI client created:', Boolean(openai));

// Azure example: set AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT,
// OPENAI_API_VERSION, and optionally AZURE_OPENAI_DEPLOYMENT first.
// const azure = createAzureOpenAI({ deployment: process.env.AZURE_OPENAI_DEPLOYMENT });
// console.log('Azure client created:', Boolean(azure));

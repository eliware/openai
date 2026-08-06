import { createOpenAI, createAzureOpenAI } from '@eliware/openai';

// Uses OPENAI_API_KEY, or pass the full SDK options object explicitly.
const openai = createOpenAI({ timeout: 30_000, maxRetries: 3 });
console.log('OpenAI client created:', Boolean(openai));

// Azure example: provide the required environment variables to run this branch.
if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT && process.env.OPENAI_API_VERSION) {
  const azure = createAzureOpenAI({ deployment: process.env.AZURE_OPENAI_DEPLOYMENT });
  console.log('Azure client created:', Boolean(azure));
}

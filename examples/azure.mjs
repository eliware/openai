import { createAzureOpenAI } from '@eliware/openai';

const openai = createAzureOpenAI({ deployment: process.env.AZURE_OPENAI_DEPLOYMENT });
const response = await openai.responses.create({ model: 'gpt-5.6-luna', input: 'Say hello.' });
console.log(response);

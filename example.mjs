import { createOpenAI } from '@eliware/openai';
const openai = await createOpenAI();
console.log('OpenAI client created:', openai);
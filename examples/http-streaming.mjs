import { createOpenAI } from '@eliware/openai';

const openai = createOpenAI();
const stream = await openai.responses.create({ model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini', input: 'Count to three.', stream: true });
for await (const event of stream) console.log(event);

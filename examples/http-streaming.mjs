import { createOpenAI } from '@eliware/openai';

const openai = createOpenAI();
const stream = await openai.responses.create({ model: 'gpt-5.6-luna', input: 'Count to three.', stream: true });
for await (const event of stream) console.log(event);

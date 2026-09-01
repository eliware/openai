import { createOpenAI } from '@eliware/openai';

const openai = createOpenAI({
  transport: 'websocket',
});

try {
  const response = await openai.responses.create({ model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini', input: 'Say hello.' });
  console.log(response.output);
} finally {
  await openai.responses.close();
}

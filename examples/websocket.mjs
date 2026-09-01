import { createOpenAI } from '@eliware/openai';

const openai = createOpenAI({
  transport: 'websocket',
});

try {
  const response = await openai.responses.create({ model: 'gpt-5.6-luna', input: 'Say hello.' });
  console.log(response.output);
} finally {
  await openai.responses.close();
}

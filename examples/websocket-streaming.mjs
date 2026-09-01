import { createOpenAI } from '@eliware/openai';

const openai = createOpenAI({ transport: 'websocket' });
try {
  const events = openai.responses.create({ model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini', input: 'Count to three.', stream: true });
  for await (const event of events) console.log(event);
} finally {
  await openai.responses.close();
}

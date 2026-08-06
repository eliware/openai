import { createOpenAI } from '@eliware/openai';

const openai = createOpenAI({ transport: 'websocket' });
try {
  const events = openai.responses.create({ model: 'gpt-5.6-luna', input: 'Count to three.', stream: true });
  for await (const event of events) console.log(event);
} finally {
  openai.responses.close();
}

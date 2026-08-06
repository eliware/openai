import { createOpenAI } from '@eliware/openai';

const openai = createOpenAI();
const models = await openai.models.list();
console.log(models.data.map(({ id }) => id));

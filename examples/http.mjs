import { createOpenAI } from "@eliware/openai";

if (!process.env.OPENAI_API_KEY) {
  console.log("Set OPENAI_API_KEY to run this live API example.");
  process.exit(0);
}

const openai = createOpenAI();
const models = await openai.models.list();
console.log(models.data.map(({ id }) => id));

import { createOpenAI } from "@eliware/openai";

if (!process.env.OPENAI_API_KEY) {
  console.log("Set OPENAI_API_KEY to run this live API example.");
  process.exit(0);
}

const openai = createOpenAI();
const stream = await openai.responses.create({
  model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  input: "Count to three.",
  stream: true,
});
for await (const event of stream) console.log(event);

import { createOpenAI } from "@eliware/openai";

if (!process.env.OPENAI_API_KEY) {
  console.log("Set OPENAI_API_KEY to run this live API example.");
  process.exit(0);
}

const openai = createOpenAI({
  transport: "websocket",
});

try {
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    input: "Say hello.",
  });
  console.log(response.output);
} finally {
  await openai.responses.close();
}

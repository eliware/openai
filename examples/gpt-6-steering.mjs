import { createOpenAI } from "@eliware/openai";

if (!process.env.OPENAI_API_KEY) {
  console.log("Set OPENAI_API_KEY to run this live API example.");
  process.exit(0);
}

const openai = createOpenAI({ transport: "websocket" });
const model = process.env.OPENAI_MODEL ?? "gpt-6-astra";
let steeringSent = false;

try {
  const events = openai.responses.stream({ model, input: "Draft a short project plan." });
  for await (const event of events) {
    if (event.type === "response.created" && !steeringSent) {
      steeringSent = true;
      openai.responses.steer(event.response.id, "Keep the plan small enough for one developer.");
    }
    console.log(event);
  }
} finally {
  await openai.responses.close();
}

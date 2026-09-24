import { createOpenAI } from "@eliware/openai";

if (!process.env.OPENAI_API_KEY) {
  console.log("Set OPENAI_API_KEY to run this live API example.");
  process.exit(0);
}

const openai = createOpenAI();
const model = process.env.OPENAI_MODEL ?? "gpt-6-astra";
const toolResults = [];
let responseId;
let responseText = "";

async function lookupProjectStatus() {
  // Replace this placeholder with application-owned asynchronous work.
  return { status: "example result" };
}

for await (const event of openai.responses.stream({
  model,
  input: "Look up the current project status, then summarize it.",
  tools: [
    {
      type: "function",
      name: "lookup_project_status",
      description: "Look up the project status in the application.",
      async: true,
      parameters: { type: "object", properties: {}, required: [], additionalProperties: false },
    },
  ],
})) {
  if (event.type === "response.output_text.delta") {
    responseText += event.delta;
    process.stdout.write(event.delta);
  }
  if (
    event.type === "response.output_item.done" &&
    event.item.type === "function_call" &&
    event.item.async
  ) {
    const call = event.item;
    // Start the caller-owned task immediately; keep its original call_id for the result.
    toolResults.push(
      lookupProjectStatus(JSON.parse(call.arguments)).then((result) => ({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
      })),
    );
  }
  if (event.type === "response.completed") responseId = event.response.id;
}

if (toolResults.length === 0) {
  if (!responseText) console.log("No asynchronous function call was requested.");
} else {
  const input = await Promise.all(toolResults);
  const continuation = await openai.responses.create({
    model,
    previous_response_id: responseId,
    input,
  });
  console.log(continuation.output_text);
}

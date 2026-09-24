# Pricing

The pricing API supports standard text-token pricing for GPT-5.6 Luna, Terra,
and Sol, plus GPT-6 Astra, Sol, and Luna. It normalizes Responses API usage,
applies the documented long-context and cache-write policies, calculates
auditable breakdowns, and aggregates requests by model.

```js
import { calculateUsageCost } from "@eliware/openai";

const cost = calculateUsageCost("gpt-6-luna", response.usage);
```

Fast service tiers, hosted-tool call fees, batch pricing, and other modality
charges are outside this module.

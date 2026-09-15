# Pricing

The pricing API supports GPT-5.6 Luna, Terra, and Sol standard text-token
pricing. It normalizes Responses API usage, applies the documented long-context
and cache-write policies, calculates auditable breakdowns, and aggregates
requests by model.

```js
import { calculateUsageCost } from '@eliware/openai/pricing';

const cost = calculateUsageCost('gpt-5.6-luna', response.usage);
```

Fast service tiers, hosted-tool call fees, batch pricing, and other modality
charges are outside this module.

# Pricing

The pricing API supports standard text-token pricing for GPT-5.6 Luna, Terra,
and Sol, plus GPT-6 Astra, Sol, 6.1 Sol, and Luna. Rates use USD per million
tokens.

| Model         |  Input | Cached input | Cache write | Output |
| ------------- | -----: | -----------: | ----------: | -----: |
| GPT-5.6 Luna  |  $0.20 |        $0.02 |       $0.25 |  $1.20 |
| GPT-5.6 Terra |  $2.00 |        $0.20 |       $2.50 | $12.00 |
| GPT-5.6 Sol   |  $4.00 |        $0.40 |       $5.00 | $20.00 |
| GPT-6 Astra   | $10.00 |        $1.00 |      $12.50 | $50.00 |
| GPT-6 Sol     |  $2.00 |        $0.20 |       $2.50 | $10.00 |
| GPT-6.1 Sol   |  $2.00 |        $0.10 |       $2.50 | $10.00 |
| GPT-6 Luna    |  $0.10 |        $0.01 |      $0.125 |  $0.50 |

GPT-5.6 Sol has promotional pricing through at least November 21, 2026.
OpenAI can change prices. Check the [OpenAI pricing page](https://developers.openai.com/api/docs/pricing)
before you use these estimates.

The calculator uses standard rates. It does not apply Fast, Ultrafast, Batch,
Flex, or regional processing rates. It normalizes Responses API usage, applies
the documented long-context and cache-write policies, calculates cost
breakdowns, and aggregates requests by model.

```js
import { calculateUsageCost } from "@eliware/openai";

const cost = calculateUsageCost("gpt-6-luna", response.usage);
```

Fast service tiers, hosted-tool call fees, batch pricing, and other modality
charges are outside this module.

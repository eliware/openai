# Pricing

The pricing API estimates standard text-token costs for supported models. Rates use USD per million tokens.

| Model         |  Input | Cached input | Cache write | Output |
| ------------- | -----: | -----------: | ----------: | -----: |
| GPT-5.6 Luna  |  $0.20 |        $0.02 |       $0.25 |  $1.20 |
| GPT-5.6 Terra |  $2.00 |        $0.20 |       $2.50 | $12.00 |
| GPT-5.6 Sol   |  $4.00 |        $0.40 |       $5.00 | $20.00 |
| GPT-6 Astra   | $10.00 |        $1.00 |      $12.50 | $50.00 |
| GPT-6 Sol     |  $2.00 |        $0.20 |       $2.50 | $10.00 |
| GPT-6.1 Sol   |  $2.00 |        $0.10 |       $2.50 | $10.00 |
| GPT-6 Luna    |  $0.10 |        $0.01 |      $0.125 |  $0.50 |

GPT-5.6 Sol has promotional pricing through at least November 21, 2026. OpenAI can change rates. Check the [OpenAI pricing page](https://developers.openai.com/api/docs/pricing) before you use an estimate.

## Usage fields

Pass the `usage` object from a Responses API result. The calculator reads `input_tokens`, `output_tokens`, `input_tokens_details.cached_tokens`, and `input_tokens_details.cache_write_tokens`.

Missing fields count as zero. Each value must be a non-negative integer. Cached and cache-write tokens together must not exceed input tokens. Invalid data causes an error with code `INVALID_USAGE`.

## Cost rules

The calculator applies cached-input rates to cached tokens. It applies input rates with a 1.25 multiplier to cache-write tokens. It applies input rates to the remaining input tokens.

When input exceeds 272,000 tokens, the calculator doubles input rates and multiplies output rates by 1.5. It does not apply this rule at or below 272,000 tokens.

The calculator rounds cost fields to six decimal places. `calculateUsageCost()` returns the estimated total in USD. `calculateUsageCostBreakdown()` returns token counts, cost fields, and a `long_context` flag.

```js
import { calculateUsageCostBreakdown } from "@eliware/openai";

const estimate = calculateUsageCostBreakdown("gpt-6-luna", response.usage);
console.log(estimate.estimated_cost_usd);
```

Use `createPricingAccumulator()` to sum request costs by model:

```js
import { createPricingAccumulator } from "@eliware/openai";

const totals = createPricingAccumulator();
totals.add("gpt-6-luna", response.usage);
console.log(totals.summary());
```

The estimate covers reported standard text-token usage. It excludes Fast, Ultrafast, Batch, Flex, regional processing, hosted-tool fees, and other modality charges. It does not equal a complete invoice.

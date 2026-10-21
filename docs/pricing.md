# Pricing

The pricing API estimates standard text-token costs for seven supported model IDs.
The package stores rates in its local catalog.
It does not retrieve prices from the OpenAI API.

The table shows standard rates for requests with no more than 272,000 input tokens.
Rates use USD for each million tokens.

| Model ID        |  Input | Cached input | Cache write | Output |
| --------------- | -----: | -----------: | ----------: | -----: |
| `gpt-5.6-luna`  |  $0.20 |        $0.02 |       $0.25 |  $1.20 |
| `gpt-5.6-terra` |  $2.00 |        $0.20 |       $2.50 | $12.00 |
| `gpt-5.6-sol`   |  $4.00 |        $0.40 |       $5.00 | $20.00 |
| `gpt-6-astra`   | $10.00 |        $1.00 |      $12.50 | $50.00 |
| `gpt-6-sol`     |  $2.00 |        $0.20 |       $2.50 | $10.00 |
| `gpt-6.1-sol`   |  $2.00 |        $0.10 |       $2.50 | $10.00 |
| `gpt-6-luna`    |  $0.10 |        $0.01 |      $0.125 |  $0.50 |

These values match the package catalog and the [OpenAI API pricing page](https://developers.openai.com/api/docs/pricing) checked on 2026-10-21.
The [GPT-5.6 Sol model page](https://developers.openai.com/api/docs/models/gpt-5.6-sol) lists its promotional pricing end date.
OpenAI can change rates, so check the current pages before you use an estimate.

## Usage data

Pass the `usage` object from a Responses API result.
The calculator reads `input_tokens`, `output_tokens`,
`input_tokens_details.cached_tokens`, and `input_tokens_details.cache_write_tokens`.
Missing fields count as zero.

Each token count must be a non-negative integer.
The sum of cached and cache-write tokens must not be more than the input token count.
The calculator rejects invalid usage with an error code of `INVALID_USAGE`.
The calculator rejects model IDs that do not appear in the table.

## Cost rules

The calculator applies the cached-input rate to cached tokens.
It applies the cache-write rate to cache-write tokens.
The cache-write rate is 1.25 times the input rate in the package catalog.
It applies the input rate to other input tokens.
It applies the output rate to output tokens.
The calculator rounds each cost field to six decimal places.

When input is more than 272,000 tokens, the calculator doubles input, cached-input, and cache-write costs.
It multiplies output costs by 1.5 for the full request.
At 272,000 tokens or less, it uses the listed rates.

## Estimate a request

Call `calculateUsageCostBreakdown()` to get the token counts and cost fields.
Call `calculateUsageCost()` to get only the estimated total.

```js
import { calculateUsageCostBreakdown } from "@eliware/openai";

const usage = {
  input_tokens: 1_000,
  input_tokens_details: { cached_tokens: 200, cache_write_tokens: 100 },
  output_tokens: 300,
};
const estimate = calculateUsageCostBreakdown("gpt-6-luna", usage);
console.log(estimate.estimated_cost_usd);
console.log(estimate.cached_input_cost_usd);
```

The cost details include model ID, input and output token counts, cached and cache-write token counts,
individual cost fields, the total, and a `long_context` flag.

## Add request totals

Call `add(model, usage)` for each request.
Call `summary()` to read totals by model and for all requests.

```js
import { createPricingAccumulator } from "@eliware/openai";

const totals = createPricingAccumulator();
totals.add("gpt-6-luna", usage).add("gpt-6-sol", usage);
console.log(totals.summary());
```

The summary includes request counts, token totals, and estimated costs for each model.

## Limits

The calculator estimates reported standard text-token usage only.
It excludes accelerated, ultra-fast, batch, flexible, and regional rate changes.
It also excludes image, audio, hosted-tool, and other non-token charges.
The estimate is not a complete invoice.

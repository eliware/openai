# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/openai [![npm](https://img.shields.io/npm/v/@eliware/openai)](https://www.npmjs.com/package/@eliware/openai) [![License](https://img.shields.io/github/license/eliware/openai)](https://github.com/eliware/openai/blob/main/LICENSE) [![CI](https://github.com/eliware/openai/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/openai/actions/workflows/ci.yaml)

A simple OpenAI API client wrapper for Node.js, with ESM and TypeScript support.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [API](#api)
- [Packaging](#packaging)
- [Examples](#examples)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

- Use HTTP or select the Responses WebSocket transport.
- Read normalized events and typed response errors.
- Estimate token costs for GPT-5.6, GPT-6, and GPT-6.1 models.

## Requirements

Use Node.js 26 or later. Set an OpenAI API key for authenticated requests.

## Setup

Install the package with `npm install @eliware/openai`. Version 12.0.0 needs an authorized release before you can install it.

Set `OPENAI_API_KEY` or pass `apiKey` to `createOpenAI()`. See [configuration](docs/configuration.md).

## Usage

```js
import { createOpenAI } from "@eliware/openai";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await openai.responses.create({ model: "gpt-6-luna", input: "Hello" });
console.log(response.output_text);
```

HTTP is the default transport. Set `transport: "websocket"` to select WebSocket. See [transport guidance](docs/transports.md).

The pricing API estimates standard text-token costs. It does not calculate a complete invoice. See [pricing](docs/pricing.md).

Read the [release notes](RELEASE_NOTES.md) for version details.

## Development

Read [AGENTS.md](AGENTS.md), [user documentation](docs/README.md), and [specifications](specs/README.md) before you change the package. Run `npm ci` to install locked dependencies.

## Testing

Run `npm test` for the full validation. Run `npm run typecheck` to check public declarations.

## Troubleshooting

- Set `OPENAI_API_KEY` or pass `apiKey` when client creation fails for a missing key.
- Await `responses.close()` when you use the WebSocket transport.
- Review the pricing exclusions when costs differ from a provider invoice.

## Security

Keep API keys and endpoint credentials private. Use environment variables or a secret manager. Never commit `.env` or log credentials.

## API

Import the package root to use `createOpenAI`, pricing functions, transport adapters, and public types. See [API declarations](src/index.d.ts).

## Packaging

The package includes its runtime modules, declarations, examples, documentation, and specifications. The publication workflow checks the tag and uses npm provenance. Publication still needs the Operations release handoff.

## Examples

See [examples/README.md](examples/README.md) for runnable examples and prerequisites. Start with the [basic example](examples/basic/README.md).

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/openai)
- [Bug Reports](https://github.com/eliware/openai/issues)
- [npm](https://www.npmjs.com/package/@eliware/openai)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)

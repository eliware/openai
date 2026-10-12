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

- Use HTTP by default or select the Responses WebSocket transport.
- Read typed events and `ResponsesError` details.
- Estimate standard text-token costs for supported GPT-5.6 and GPT-6 models.

## Requirements

Use Node.js 26 or later. Set an OpenAI API key for authenticated requests.

## Setup

Install the published package with `npm install @eliware/openai`. Set `OPENAI_API_KEY` or pass `apiKey` to `createOpenAI()`. See [configuration](docs/configuration.md).

## Usage

```js
import { createOpenAI } from "@eliware/openai";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await openai.responses.create({ model: "gpt-6-luna", input: "Hello" });
console.log(response.output_text);
```

HTTP is the default. Set `transport: "websocket"` to use WebSocket. See the [transport guide](docs/transports.md) and [documentation index](docs/README.md).

See [pricing](docs/pricing.md) for cost estimates. Read [release notes](RELEASE_NOTES.md) for user changes. See [specifications](specs/README.md) for package contracts.

## Development

Read [contributor rules](AGENTS.md), [user docs](docs/README.md), and [specifications](specs/README.md) before you edit. Run `npm ci` to install locked dependencies.

## Testing

Run `npm test` for package checks. Run `npm run typecheck` to check TypeScript declarations.

## Troubleshooting

- Set `OPENAI_API_KEY` or pass `apiKey` if client setup reports a missing key.
- Await `responses.close()` after you use the WebSocket transport.
- See [troubleshooting](docs/troubleshooting.md) for error details.

## Security

Keep API keys and endpoint credentials private. Use environment variables or a secret manager. Do not commit `.env` or log credentials.

## API

Import from the package root. See the [API guide](docs/api.md) and [type declarations](src/index.d.ts).

## Packaging

The package includes runtime modules, declarations, examples, docs, and specifications. The publish workflow checks the tag and uses npm provenance. Release approval follows Eliware Operations.

## Examples

See [examples](examples/README.md) for commands and expected results. Start with the [basic guide](examples/basic/README.md).

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

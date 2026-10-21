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

- Send Responses requests with HTTP or WebSocket.
- Read typed events and structured error details.
- Estimate text-token costs for supported model IDs.
- Send structured operation records to a logger.

## Requirements

Use Node.js 26 or later. Set an OpenAI API key for authenticated requests.

## Setup

Install the package with `npm install @eliware/openai`. Set `OPENAI_API_KEY` or pass `apiKey` to `createOpenAI()`.
Read [configuration](docs/configuration.md) for options and credential setup.

## Usage

```js
import { createOpenAI } from "@eliware/openai";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await openai.responses.create({ model: "gpt-6-luna", input: "Hello" });
console.log(response.output_text);
```

HTTP is the default transport. Set `transport: "websocket"` to select WebSocket.
Read the [transport guide](docs/transports.md) and [documentation index](docs/README.md).
Read [pricing](docs/pricing.md) for cost estimates. Read [release notes](RELEASE_NOTES.md) for user changes.

## Development

Read [AGENTS.md](AGENTS.md) for contributor rules and [specifications](specs/README.md) for package contracts.
Run `npm ci` to install the locked dependencies.

## Testing

Run `npm test` for package validation. Run `npm run typecheck` to check TypeScript declarations.

## Troubleshooting

Read [troubleshooting](docs/troubleshooting.md) for error details and recovery steps.

## Security

Keep API keys and endpoint credentials private. Use environment variables or a secret manager.
Do not commit `.env` files or log credentials.

## API

Import public names from the package root, `@eliware/openai`. Read the [API guide](docs/api.md) and [type declarations](src/index.d.ts).

## Packaging

The package includes `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, `examples/`, `specs/`, and `.env.example`.
Match each `v#.#.#` release tag to the version in `package.json`.
The publish workflow uses npm provenance. Request authorization from Eliware Operations before publication.

## Examples

Read [examples/README.md](examples/README.md) for example commands and results.

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

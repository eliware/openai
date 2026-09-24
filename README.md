# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/openai [![npm version](https://img.shields.io/npm/v/@eliware/openai.svg)](https://www.npmjs.com/package/@eliware/openai) [![license](https://img.shields.io/github/license/eliware/openai.svg)](LICENSE) [![CI](https://github.com/eliware/openai/actions/workflows/ci.yml/badge.svg)](https://github.com/eliware/openai/actions/workflows/ci.yml)

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
- [License](#license)
- [Links](#links)

## Features

Purpose: `@eliware/openai` is an ESM-first Node.js wrapper around the official OpenAI SDK. It provides explicit HTTP and Responses WebSocket transports, typed public exports, streaming helpers, and a token-usage pricing calculator. It is intended for Node.js applications that want the SDK with these transport and pricing utilities. The package description is: A simple OpenAI API client wrapper for Node.js, with ESM and TypeScript support.

- HTTP and explicitly selected WebSocket Responses transports.
- Normalized events, abort support, bounded shutdown, and typed errors.
- Standard text-token estimates and per-model pricing aggregation for GPT-5.6 and GPT-6 models.

Maintained by Eliware <eliware@eliware.org>. Author: Eliware <eliware@eliware.org>. License: MIT. Copyright (c) 2026 Eliware. See [LICENSE](LICENSE).

## Requirements

- Node.js 26 or newer.
- An OpenAI API key for authenticated requests.

## Setup

Install the published package with `npm install @eliware/openai`. Version 8.0.0 is the current repository version and should not be assumed available until its authorized publication. Package versions are declared in `package.json` and documented in [release notes](RELEASE_NOTES.md); publication occurs only after the authorized release handoff.

### Configuration

Runtime configuration is `OPENAI_API_KEY`, supplied through the environment or the `apiKey` option to `createOpenAI()`. The package has no runtime configuration file or command-line interface. Use [`.env.example`](.env.example) as a safe local template; keep real credentials in an untracked `.env` or secret manager.

## Usage

The root package entrypoint is `@eliware/openai`; its runtime entry is `index.mjs` and TypeScript declarations are in `index.d.ts`. This repository targets package version 8.0.0; check the published version before installing, and use that exact version only after its authorized release and publication.

```js
import { createOpenAI } from "@eliware/openai";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await openai.responses.create({ model: "gpt-6-luna", input: "Hello" });
console.log(response.output_text);
```

The API key may instead be supplied through `OPENAI_API_KEY`. HTTP is the default. WebSocket transport is selected with `transport: 'websocket'`; it supports one in-flight response request per client, does not reconnect or replay interrupted requests, and requires a Node-compatible socket implementation. See [configuration](docs/configuration.md) and [transports](docs/transports.md).

The pricing API supports GPT-5.6 Luna, Terra, and Sol, plus GPT-6 Astra, Sol, and Luna. It estimates standard text-token charges from Responses API usage; it is not a complete invoice calculator. Rates and exclusions are described in [pricing docs](docs/pricing.md).

## Development

Read [contributor instructions](AGENTS.md), [user documentation](docs/README.md), and [specifications](specs/README.md). The repository uses native ESM, mirrored `src/` and `tests/` modules, and Node.js 26. Install dependencies with `npm ci`.

## Testing

Run `npm test` for the aggregate shared validation and coverage gate, `npm run lint` for lint and workspace policy checks, and `npm run typecheck` for declaration validation. Keep coverage at 100% for statements, branches, functions, and lines. The full validation requirements are described in [AGENTS.md](AGENTS.md).

## Troubleshooting

- Missing-key errors: provide `apiKey` or set `OPENAI_API_KEY` in the process environment.
- WebSocket readiness or shutdown issues: review [transport guidance](docs/transports.md) and await `responses.close()`.
- Pricing discrepancies: the calculator estimates supported standard token charges only; provider billing may include excluded services or pricing modes.

## Security

Treat API keys and endpoint credentials as secrets. Store them in environment variables or a secret manager; never commit `.env`, log credentials, or include real keys in tests and examples. See [`.env.example`](.env.example) for the supported environment setting.

## API

The public API consists of `createOpenAI`, the exported pricing functions and types, and the declared client/event/error types. `createOpenAI()` creates a client using the official SDK options; set `transport: 'websocket'` to opt into the WebSocket adapter. `calculateUsageCostBreakdown()` estimates one response, while `createPricingAccumulator()` aggregates usage. The package does not support the removed `responses-ws` alias, Azure construction, implicit reconnect, or browser-native WebSocket constructors. See [API and transport documentation](docs/README.md) and [the type declarations](index.d.ts).

## Packaging

The package ships its root ESM entrypoint, declarations, `src/`, and allowlisted documentation, specifications, and examples. Validate the exact packed file list with the shared pack stage before release consideration. Public publication uses npm provenance and an exact version tag matching `package.json`; it requires an explicit release handoff. See [release notes](RELEASE_NOTES.md).

## Examples

Runnable examples and their prerequisites are indexed in [examples/README.md](examples/README.md). Start with the [basic example](examples/basic/README.md); transport and GPT-6 examples are also available.

## Support

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

For help, questions, or to chat with the Eliware team and community, visit [Eliware on Discord](https://discord.gg/M6aTR9eTwN), [GitHub](https://github.com/eliware/openai), or [eliware@eliware.org](mailto:eliware@eliware.org).

## License

MIT © Eliware. See [LICENSE](LICENSE).

## Links

- [Eliware home](https://eliware.org)
- [Eliware GitHub organization](https://github.com/eliware)
- [GitHub repository](https://github.com/eliware/openai)
- [npm package](https://www.npmjs.com/package/@eliware/openai)
- Documentation: [docs](docs/README.md), [specifications](specs/README.md), [examples](examples/README.md)
- [Documentation index](docs/README.md)
- [Specifications index](specs/README.md)
- [Applicable convention profiles](specs/directives.json)
- [Local authority registry](specs/authority.json)
- [Public contract overview](specs/overview.json)
- [Project requirements](specs/requirements.json)
- [Responses transport contract](specs/responses.json)
- [Pricing contract](specs/pricing.json)
- [Explicit non-goals](specs/out-of-scope.json)
- [Examples index](examples/README.md)
- [Release notes](RELEASE_NOTES.md)

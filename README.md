# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/openai [![npm version](https://img.shields.io/npm/v/@eliware/openai.svg)](https://www.npmjs.com/package/@eliware/openai)[![license](https://img.shields.io/github/license/eliware/openai.svg)](LICENSE)[![build status](https://github.com/eliware/openai/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/openai/actions)

> A simple OpenAI API client wrapper for Node.js, with ESM and TypeScript support.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [TypeScript](#typescript)
- [License](#license)

## Features

- Minimal wrapper for the official OpenAI Node.js SDK
- ESM-first and TypeScript-ready
- Simple API key management (env or parameter)
- Example usage and tests included

## Installation

```bash
npm install @eliware/openai
```

## Usage

```js
import { createOpenAI } from '@eliware/openai';

(async () => {
  // Optionally pass your API key, or set OPENAI_API_KEY in your environment
  const openai = await createOpenAI();
  // Example: list models
  // const models = await openai.models.list();
  // console.log(models);
})();
```

## API

### `createOpenAI(apiKey?: string): Promise<OpenAI>`

Creates and returns a new OpenAI client instance. If `apiKey` is not provided, it will use `process.env.OPENAI_API_KEY`.

- `apiKey` (optional): Your OpenAI API key. If omitted, the function will use the `OPENAI_API_KEY` environment variable.
- Returns: A Promise that resolves to an OpenAI client instance.
- Throws: If no API key is provided.

## TypeScript

Type definitions are included:

```ts
import { createOpenAI } from '@eliware/openai';
import type OpenAI from 'openai';
const openai: OpenAI = await createOpenAI();
```

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## License

[MIT © 2025 Eli Sterling, eliware.org](LICENSE)

## Links

- [Home Page](https://eliware.org)
- [GitHub](https://github.com/eliware/openai)
- [npm](https://www.npmjs.com/package/@eliware/openai)
- [Discord](https://discord.gg/M6aTR9eTwN)

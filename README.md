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
- Simple API key management (environment or parameter)
- Full OpenAI SDK option passthrough, including endpoints, timeouts, retries, and custom fetch
- Azure OpenAI client helper with environment-variable support
- Selectable HTTP or Responses WebSocket transport
- Streaming and non-streaming Responses API calls
- Configurable WebSocket reconnect behavior and queueing
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

### `createOpenAI(options?: string | OpenAIOptions): OpenAIClient`

Creates and returns a new OpenAI client instance. Pass an API key string for compatibility, or an options object accepted by the official SDK. The API key defaults to `OPENAI_API_KEY`.

```js
createOpenAI('sk-...');
createOpenAI({ apiKey: 'sk-...', baseURL: 'https://api.example.test/v1', timeout: 30_000, maxRetries: 3 });
```

### WebSocket Responses transport

HTTP is the default. Select the Responses WebSocket transport when needed:

```js
const openai = createOpenAI({
  apiKey: 'sk-...',
  transport: 'websocket',
  reconnect: { maxRetries: 5 },
});

const response = await openai.responses.create({ model: 'gpt-5.6-luna', input: 'Hello' });
const events = openai.responses.stream({ model: 'gpt-5.6-luna', input: 'Hello' });
for await (const event of events) console.log(event);

openai.responses.close();
```

The WebSocket adapter also supports the familiar `responses.stream()` helper and preserves `inputItems` and `inputTokens` resources. The connection remains available while the client is retained. Automatic reconnect is opt-in: configure it with `reconnect`. The WebSocket adapter
continues to expose HTTP Responses helpers such as `retrieve`, `delete`, `cancel`, and
`parse`. Call `responses.close()` during shutdown.

### `createAzureOpenAI(options?: AzureOpenAIOptions): OpenAIClient`

Creates an Azure OpenAI client. Options may include `apiKey`, `endpoint`, `apiVersion`, and `deployment`; these default to `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`, and `OPENAI_API_VERSION`.

```js
const openai = createAzureOpenAI({ deployment: 'gpt-5.6-luna' });
```

Both helpers throw clear errors when required configuration is missing.

## TypeScript

Type definitions are included:

```ts
import { createOpenAI } from '@eliware/openai';
import type OpenAI from 'openai';
import { createOpenAI, createAzureOpenAI } from '@eliware/openai';
const openai: import('@eliware/openai').OpenAIClient = createOpenAI();
const azure: import('@eliware/openai').OpenAIClient = createAzureOpenAI();
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

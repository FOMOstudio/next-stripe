# next-ai-stream

```bash
pnpm add next-stripe
```

```bash
npm install next-stripe
```

```bash
yarn add next-stripe
```

## Overview

**`next-stripe`** is a lightweight, plug-and-play package to handle Stripe webhooks in **Next.js 15** projects using the **App Router**. It simplifies integration and offer a fully typed event structure.

With just a few lines of code, you can:

- **Set up a secure Stripe webhooks API route** in Next.js.
- **Work with typed event** with a callback like structure.
- **Supports connected account** (Receive webhooks for Stripe accounts managed by your Stripe account).
- **Supports auto-refetch data** (Refetch subscription / customer data to prevent bugs when receiving events in the wrong order)

This package handles the complex parts of working with Stripe webhooks, so you can focus on building your app. 🚀

## Usage

### 1. Add OpenAI Client

```typescript
// src/ai/index.ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: "https://api.x.ai/v1", // can use xAI API since it's compatible with OpenAI SDK
});

export default client;
```

### 2. Add Next.js API Route

```typescript
// src/app/api/stripe/webhooks.ts

import { createAIChatStreamRouteHandlers } from "next-stripe";

export const dynamic = "force-dynamic";

export const { POST } = createStripeWebhookHandlers({
  client,
  model: "grok-2-latest", // use whatever model you want
});
```

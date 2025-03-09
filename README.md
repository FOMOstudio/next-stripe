# next-stripe

```bash
pnpm add next-stripe stripe
```

```bash
npm install next-stripe stripe
```

```bash
yarn add next-stripe stripe
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

### 1. Add a stripe initialization util in your project

```typescript
// src/utils/stripe.ts
import Stripe from "stripe";

const { STRIPE_SECRET_KEY } = process.env;

// Check env var
if (!STRIPE_SECRET_KEY) throw new Error("You must provide STRIPE env vars.");

const stripe = new Stripe(STRIPE_NEW_SECRET_KEY, {
  timeout: 80000,
  maxNetworkRetries: 5,
});

export default stripe;
```

### 2. Add Next.js API Route

```typescript
// src/app/api/stripe/webhooks.ts

import stripe from "@/utils/stripe";
import { createAIChatStreamRouteHandlers } from "next-stripe";

export const dynamic = "force-dynamic";

export const { POST } = createStripeWebhookRouter({
  stripe,
  webhookSigningSecret: process.env.STRIPE_WEBHOOK_SIGNIN_SECRET! // whsec_XXXX,
  // Prevent getting outdated data when Stripe send webhooks in wrong order
  autoRefetchSubscriptionData: true,
  // Add the handlers used by your project
  handlers: {},
});
```

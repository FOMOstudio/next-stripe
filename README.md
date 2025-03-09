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

This package handles the complex parts of **streaming AI messages**, so you can focus on building your app. 🚀

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
// src/app/api/chat/route.ts

import client from "@/ai";
import { createAIChatStreamRouteHandlers } from "next-ai-stream/server";

export const dynamic = "force-dynamic";

export const { GET, POST } = createAIChatStreamRouteHandlers({
  client,
  model: "grok-2-latest", // use whatever model you want
});
```

### 3. Start AI Chat Stream

```tsx
// src/app/page.tsx

"use client";

import { useState } from "react";
import { useAIChatStream } from "next-ai-stream/client";

function HomePage() {
  const [inputText, setInputText] = useState("");

  const { messages, submitNewMessage, loading } = useAIChatStream({
    apiEndpoint: "/api/chat",
    systemPrompt: `You are a helpful AI assistant. Be very succinct in your responses because I don't want drop all my cash on tokens.`,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    submitNewMessage(inputText);
    setInputText("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 pb-36">
      <div className="flex flex-col gap-8 w-full max-w-4xl">
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`p-4 rounded-2xl max-w-[70%] ${
                message.role === "user"
                  ? "bg-slate-800 text-white ml-auto"
                  : "bg-slate-900 text-gray-200 mr-auto"
              }`}
            >
              {message.content as string}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 w-full bg-black/90 backdrop-blur-sm py-6">
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center gap-4"
        >
          <input
            className="rounded-lg p-4 bg-slate-800 w-[500px]"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button
            className={`bg-slate-800 p-4 rounded-lg ${
              loading ? "opacity-50" : ""
            }`}
            type="submit"
            disabled={loading}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default HomePage;
```

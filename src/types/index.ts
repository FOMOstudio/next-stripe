import { NextRequest } from "next/server";
import type Stripe from "stripe";

export type NextStripeHandlers = {
  POST: (request: NextRequest) => Promise<Response>;
};

export type StripeWebhookConfig = {
  webhookSigningSecret: string;
  autoRefetchSubscriptionData?: boolean;
  stripe: Stripe;
  handlers: Record<string, (request: NextRequest) => Promise<Response>>;
};

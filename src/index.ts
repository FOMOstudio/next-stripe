/// <reference types="stripe-event-types" />

import { NextRequest, NextResponse } from "next/server";
import { NextStripeHandlers, StripeWebhookConfig } from "./types";
import Stripe from "stripe";

export function createStripeWebhookHandlers({
  webhookSigningSecret,
  stripe,
  autoRefetchSubscriptionData = false,
  handlers,
}: StripeWebhookConfig): NextStripeHandlers {
  return {
    async POST(request: NextRequest) {
      return createStripeWebhookRouter({
        request,
        stripe,
        webhookSigningSecret,
        handlers,
      });
    },
  };
}

async function createStripeWebhookRouter({
  request,
  stripe,
  webhookSigningSecret,
  handlers,
}: {
  request: NextRequest;
  stripe: Stripe;
  webhookSigningSecret: string;
  handlers: Record<string, (request: NextRequest) => Promise<Response>>;
}) {
  const signature = request.headers.get("stripe-signature") as string;
  const body = await request.text();

  if (!signature) {
    throw new Error("wrong Stripe signature");
  }

  let event;

  // Check if the event is valid and construct the event object
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSigningSecret
    ) as Stripe.DiscriminatedEvent;
  } catch (error) {
    console.log(error);
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }

  // Get the handler for the event type
  const handler = handlers[event.type];

  // Add logging for missing handlers to help with debugging
  if (!handler) {
    console.error(`No handler found for event type: ${event.type}`);
  }

  // Call the correct handler with the typed event
  try {
    await handler(request);

    // Return a 200 response to Stripe to confirm we processed the webhook
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error in handler for event type: ${event.type}`);

    return new Response(`Handler error: ${error}`, {
      status: 500,
    });
  }
}

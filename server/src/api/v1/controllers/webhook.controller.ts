import { Request, Response } from "express";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import client from "../../../db";
import crypto from "crypto";

class WebhookController {
  async clerkHandler(req: Request, res: Response) {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET);
    let payload;
    try {
      // @ts-ignore
      payload = wh.verify(req.body, req.headers);
    } catch (error) {
      // for security reasons it's better to return a 200
      return res.sendStatus(200);
    }

    const { data, type } = payload as WebhookEvent;

    switch (type) {
      case "user.created":
        const emailObject = data.email_addresses.find(
          (em) => em.id === data.primary_email_address_id
        )!;

        const user = {
          firstName: data.first_name,
          lastName: data.last_name,
          email: emailObject.email_address,
          clerkId: data.id,
        };

        // This is for idempotency i.e If the webhook is called twice, the user will be created only once
        await client.user.upsert({
          create: user,
          where: { clerkId: user.clerkId },
          update: {},
        });
    }

    res.sendStatus(200);
  }

  async paystackHandler(req: Request, res: Response) {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    // Validate webhook origin
    if (hash != req.headers["x-paystack-signature"]) return res.sendStatus(200);

    const event = req.body;
    // Only handle charge success events
    if (event.event !== "charge.success") return res.sendStatus(200);

    // Avoid handling the same tip twice
    const existingTip = await client.tip.findFirst({
      where: { reference: event.data.reference },
    });
    if (existingTip) return res.sendStatus(200);

    // Create tip and send success email
    await client.tip.create({
      data: {
        email: event.data.customer.email,
        reference: event.data.reference,
        message: event.data.metadata.message,
        amount: event.data.amount / 100, // event.data.amount is in smallest denomination e.g kobo, pesewas and cents
        tokenCount: Number(event.data.metadata.tokenCount),
        user: { connect: { id: Number(event.data.metadata.userId) } },
        currency: { connect: { code: event.data.currency } },
      },
    });

    // todo: send thank you email to tipper
    res.sendStatus(200);
  }
}

export default new WebhookController();

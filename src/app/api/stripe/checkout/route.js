export const runtime = "nodejs"

import Stripe from "stripe"

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price: "price_1SxeKjBBvDjH8S8PAuLbr4PS",
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
  })

  return Response.json({ url: session.url })
}

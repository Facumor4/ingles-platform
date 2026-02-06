export const runtime = "nodejs"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price: "price_1SxeKjBBvDjH8S8PAuLbr4PS", // tu price real
        quantity: 1,
      },
    ],
    success_url: "https://tu-dominio.vercel.app",
    cancel_url: "https://tu-dominio.vercel.app",
    metadata: {
      user_id: user.id,
    },

  })

  return Response.json({ url: session.url })
}

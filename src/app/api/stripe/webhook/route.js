export const runtime = "nodejs"

import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const email = session.customer_email

    const { data: authUser } = await supabase.auth.admin.listUsers()
    const usuario = authUser.users.find(u => u.email === email)

    if (usuario) {
      const { data: clases } = await supabase.from("clases").select("id")

      for (const clase of clases) {
        await supabase.from("accesos_clases").insert({
          user_id: usuario.id,
          clase_id: clase.id,
          habilitado: true,
        })
      }
    }
  }

  return new Response("ok", { status: 200 })
}

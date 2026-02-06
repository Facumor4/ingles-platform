export const runtime = "nodejs"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
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

    // 🔥 ESTE es el dato importante
    const userId = session.metadata.user_id

    if (!userId) {
      console.log("No vino user_id en metadata")
      return new Response("ok", { status: 200 })
    }

    // Dar acceso a todas las clases
    const { data: clases } = await supabase.from("clases").select("id")

    for (const clase of clases) {
      await supabase.from("accesos_clases").insert({
        user_id: userId,
        clase_id: clase.id,
        habilitado: true,
      })
    }

    console.log("Accesos otorgados a user:", userId)
  }

  return new Response("ok", { status: 200 })
}

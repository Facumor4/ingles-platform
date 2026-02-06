export const runtime = "nodejs"
import Stripe from "stripe"

// Esta línea DEBE quedarse fuera o dentro de la función, pero es necesaria
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    // Definimos la URL base para que no te mande a localhost
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: "price_1SxeKjBBvDjH8S8PAuLbr4PS",
          quantity: 1,
        },
      ],
      // Ahora usamos baseUrl para que siempre vuelva a la web correcta
      success_url: `${baseUrl}/dashboard`,
      cancel_url: `${baseUrl}/dashboard`,
    })

    return Response.json({ url: session.url })

  } catch (error) {
    console.error("Error en Stripe:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
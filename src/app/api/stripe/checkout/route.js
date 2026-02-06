export const runtime = "nodejs"
import Stripe from "stripe"

export async function POST(req) {
  try {
    // Verificación de seguridad rápida
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json({ error: "Falta la Secret Key en el servidor" }, { status: 500 })
    }

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
      // Asegúrate de que esta variable exista en Vercel, o usa un string temporal para probar
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
    })

    return Response.json({ url: session.url })

  } catch (error) {
    console.error("Stripe Error:", error.message)
    // Esto evita que el frontend reciba un "cuerpo vacío" y falle el JSON
    return Response.json({ error: error.message }, { status: 500 })
  }
}
"use client"

import { supabase } from "@/lib/supabase"

export default function Pagar() {

  const handlePagar = async () => {
    // 1️⃣ Obtener el usuario logueado
    const { data: { session } } = await supabase.auth.getSession()

    // 2️⃣ Llamar al backend mandando el token
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    const data = await res.json()

    // 3️⃣ Redirigir a Stripe
    window.location.href = data.url
  }

  return (
    <div className="p-10">
      <button
        onClick={handlePagar}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Pagar suscripción
      </button>
    </div>
  )
}

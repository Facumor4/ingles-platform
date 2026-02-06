"use client"
import { supabase } from "@/lib/supabase" // Importamos el objeto, no la función

export default function Pagar() {
  const pagar = async () => {
    // 1. Obtener sesión
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      alert("Por favor, inicia sesión para continuar")
      return
    }

    try {
      // 2. Llamada a tu API de Stripe
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const data = await res.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No se pudo obtener la URL de pago")
      }
    } catch (err) {
      console.error(err)
      alert("Error al procesar el pago")
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Pagar acceso</h1>
      <button onClick={pagar}>Ir a pagar con Stripe</button>
    </div>
  )
}
"use client"

import { getSupabase } from "@/lib/supabase"

export default function Pagar() {

  const pagar = async () => {
    const supabase = getSupabase()

    const { data: { session } } = await supabase.auth.getSession()

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <div style={{ padding: 40 }}>
      <button
        onClick={handlePago}
        style={{
          padding: "20px 40px",
          fontSize: "20px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "8px"
        }}
      >
        PAGAR ACCESO A LAS CLASES
      </button>
    </div>
  )
}

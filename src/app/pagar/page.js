"use client"

import { createClient } from "@supabase/supabase-js"

export default function Pagar() {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const pagar = async () => {
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
      <h1>Pagar acceso</h1>
      <button onClick={pagar}>Pagar</button>
    </div>
  )
}

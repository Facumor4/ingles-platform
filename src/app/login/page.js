"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      await supabase.from("perfiles").insert([
        {
          id: data.user.id,
          acceso: false,
          email: email,
       },
      ])

      alert("Revisá tu email para confirmar el registro")
    }
  }

  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push("/dashboard")
    }
  }


  return (
    <div className="flex flex-col gap-4 p-10 max-w-md">
      <input
        className="border p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-black text-white p-2" onClick={handleLogin}>
        Login
      </button>
      <button className="bg-gray-500 text-white p-2" onClick={handleRegister}>
        Registrarse
      </button>
    </div>
  )
}

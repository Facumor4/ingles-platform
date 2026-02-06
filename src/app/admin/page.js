"use client"
import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"


export default function Admin() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const supabase = getSupabase()

    const cargar = async () => {
      const { data } = await supabase.from("perfiles").select("*")
      setUsers(data)
    }

    cargar()
  }, [])


  const toggleAccess = async (id, current) => {
    await supabase
      .from("perfiles")
      .update({ acceso: !current })
      .eq("id", id)

    fetchUsers()
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Panel de Admin</h1>

      {users.map((u) => (
        <div key={u.id} className="border p-4 mb-4 rounded">
          <p>{u.email}</p>
          <p>Acceso: {u.acceso ? "Activo" : "Inactivo"}</p>

          <button
            onClick={() => toggleAccess(u.id, u.acceso)}
            className="bg-black text-white px-4 py-2 rounded mt-2"
          >
            Cambiar acceso
          </button>
        </div>
      ))}
    </div>
  )
}

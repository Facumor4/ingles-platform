"use client"
import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"


export default function AdminAccesos() {
  const [users, setUsers] = useState([])
  const [clases, setClases] = useState([])
  const [accesos, setAccesos] = useState([])

  const supabase = getSupabase()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: usersData } = await supabase
      .from("perfiles")
      .select("id, email")

    const { data: clasesData } = await supabase
      .from("clases")
      .select("*")

    const { data: accesosData } = await supabase
      .from("accesos_clases")
      .select("*")

    setUsers(usersData)
    setClases(clasesData)
    setAccesos(accesosData)
  }

  const toggleAcceso = async (userId, claseId) => {
    const existe = accesos.find(
      (a) => a.user_id === userId && a.clase_id === claseId
    )

    if (existe) {
      await supabase
        .from("accesos_clases")
        .update({ habilitado: !existe.habilitado })
        .eq("id", existe.id)
    } else {
      await supabase.from("accesos_clases").insert({
        user_id: userId,
        clase_id: claseId,
        habilitado: true,
      })
    }

    loadData()
  }

  const tieneAcceso = (userId, claseId) => {
    const acceso = accesos.find(
      (a) => a.user_id === userId && a.clase_id === claseId
    )
    return acceso?.habilitado
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Admin de Accesos</h1>

      {users.map((user) => (
        <div key={user.id} className="mb-10 border p-6 rounded-xl">
          <h2 className="font-bold mb-4">{user.email}</h2>

          <div className="flex gap-4 flex-wrap">
            {clases.map((clase) => (
              <button
                key={clase.id}
                onClick={() => toggleAcceso(user.id, clase.id)}
                className={`px-4 py-2 rounded ${
                  tieneAcceso(user.id, clase.id)
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {clase.titulo}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

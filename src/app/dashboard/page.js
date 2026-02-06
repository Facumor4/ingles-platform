"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const [clases, setClases] = useState([])

  useEffect(() => {
    const loadClases = async () => {
      const { data } = await supabase
        .from("clases")
        .select("*")
        .order("orden", { ascending: true })

      setClases(data)
    }

    loadClases()
  }, [])

  return (
    <div className="p-10">
      <a href="/pagar">
        <button
          style={{
            padding: "12px 24px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "8px",
            marginBottom: "20px"
         }}
        >
          Ir a pagar acceso
       </button>
      </a>

      <h1 className="text-3xl font-bold mb-10">Tus Clases</h1>

      <div className="grid gap-6">
        {clases.map((clase) => (
          <Link key={clase.id} href={`/clase/${clase.carpeta}`}>
            <div className="border p-6 rounded-xl shadow cursor-pointer hover:shadow-lg">
              <h2 className="text-2xl font-bold">{clase.titulo}</h2>
              <p className="text-gray-400">{clase.descripcion}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

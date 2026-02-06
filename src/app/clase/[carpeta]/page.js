"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
const supabase = getSupabase()

export default function ClasePage() {
  const { carpeta } = useParams()
  const [files, setFiles] = useState([])

  const checkAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: clase } = await supabase
        .from("clases")
        .select("id")
        .eq("carpeta", carpeta)
        .single()

    const { data: acceso } = await supabase
        .from("accesos_clases")
        .select("habilitado")
        .eq("user_id", user.id)
        .eq("clase_id", clase.id)
        .single()

    if (!acceso?.habilitado) {
        alert("No tenés acceso a esta clase")
        return false
    }

    return true
}


  useEffect(() => {
    const loadFiles = async () => {
        const allowed = await checkAccess()
        if (!allowed) return

        const { data, error } = await supabase.storage
        .from("contenido")
        .list(carpeta, { limit: 100 })

        if (!error) setFiles(data)
    }


    loadFiles()
  }, [carpeta])

  const getFileUrl = async (fileName) => {
    const { data, error } = await supabase.storage
        .from("contenido")
        .createSignedUrl(`${carpeta}/${fileName}`, 6600)

    if (error || !data) return null

    return data.signedUrl
}   


  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Contenido de la clase</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {files.map((file) => (
          <FileItem key={file.name} file={file} getFileUrl={getFileUrl} />
        ))}
      </div>
    </div>
  )
}

function FileItem({ file, getFileUrl }) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    getFileUrl(file.name).then((url) => {
        if (url) setUrl(url)
    })

  }, [])

  if (!url) return null

  const ext = file.name.split(".").pop().toLowerCase()

  return (
    <div className="border rounded-xl shadow p-4">
      <p className="text-sm mb-2 break-words">{file.name}</p>

      {["png", "jpg", "jpeg", "webp"].includes(ext) && (
        <img src={url} alt="" className="w-full rounded" />
      )}

      {["mp4", "webm", "ogg"].includes(ext) && (
        <video controls src={url} className="w-full rounded" />
      )}

      {["mp3", "wav"].includes(ext) && (
        <audio controls src={url} className="w-full" />
      )}
    </div>
  )
}

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Exportamos la instancia directamente
export const supabase = createClient(supabaseUrl, supabaseKey)

// O si prefieres mantener tu función por alguna razón específica, 
// también exporta la constante para que la página de Admin no falle:
export function getSupabase() {
  return supabase 
}
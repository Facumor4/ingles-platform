import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kzibdhrmtxylshegbwrz.supabase.co'
const supabaseKey = 'sb_publishable_1BUxMw-KtHHLOiBOHLKKkQ_iPxrEkth'

export const supabase = createClient(supabaseUrl, supabaseKey)

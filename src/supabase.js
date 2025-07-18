import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yazrwciyjcamraukthlh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhenJ3Y2l5amNhbXJhdWt0aGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODA3MDYsImV4cCI6MjA2MTc1NjcwNn0.gjBySwQxxJD4TsF4fZ_jhuIeFTt65swxwLvGyEuN_lk'

export const supabase = createClient(supabaseUrl, supabaseKey)
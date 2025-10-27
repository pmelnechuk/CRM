import { createClient } from '@supabase/supabase-js';

// --- ¡PEGA TUS DATOS AQUÍ! ---
// Reemplaza con la URL de tu proyecto de Supabase
const supabaseUrl = "https://jrkgbogdpsvuzfjydfqj.supabase.co"; 
// Reemplaza con tu clave anónima (anon key)
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya2dib2dkcHN2dXpmanlkZnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTI1NzQsImV4cCI6MjA3NzA4ODU3NH0.X66NFYlzBV8QQB-nHgilh-pYQltBjMdKW1L_xyqtPPo";
// -----------------------------

if (!supabaseUrl || !supabaseAnonKey) {
    // This check is now mainly for ensuring the hardcoded values are not empty
    console.error("Supabase URL or Anon Key is missing. Please add your credentials to services/supabaseClient.ts.");
    // You could throw an error here to stop the app from running without credentials
    // throw new Error("Supabase credentials are not set.");
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

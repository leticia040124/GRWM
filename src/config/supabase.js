import { createClient } from "@supabase/supabase-js";

// Pega a URL do Supabase que está salva no arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Pega a Publishable Key que está salva no arquivo .env
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as configurações existem
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "As configurações do Supabase não foram encontradas no arquivo .env."
  );
}

// Cria a conexão do frontend com o Supabase
const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

// Exporta para usarmos no GuardaRoupa.jsx
export default supabase;
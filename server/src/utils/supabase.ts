import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('UWAGA: Brak zmiennych SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY w pliku .env!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
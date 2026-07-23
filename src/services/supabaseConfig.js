import { createClient } from '@supabase/supabase-js';

export const getCustomSupabaseConfig = () => {
  const custom = localStorage.getItem('printf_supabase_config');
  if (custom) {
    try {
      return JSON.parse(custom);
    } catch (e) {
      console.error("Invalid custom Supabase config stored", e);
    }
  }
  return null;
};

export const getStoredSupabaseConfig = () => {
  const custom = getCustomSupabaseConfig();
  if (custom) return custom;

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envUrl !== 'your_supabase_project_url' && envKey) {
    return { supabaseUrl: envUrl, supabaseAnonKey: envKey };
  }

  return null;
};

export const saveCustomSupabaseConfig = (config) => {
  localStorage.setItem('printf_supabase_config', JSON.stringify(config));
  window.location.reload();
};

export const clearCustomSupabaseConfig = () => {
  localStorage.removeItem('printf_supabase_config');
  window.location.reload();
};

let supabase = null;
let isSupabaseActive = false;

const config = getStoredSupabaseConfig();

if (config && config.supabaseUrl && config.supabaseAnonKey) {
  try {
    supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    isSupabaseActive = true;
  } catch (error) {
    isSupabaseActive = false;
  }
}

export { supabase, isSupabaseActive };

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl =  'https://zctaljknrzdgysuxhenh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdGFsamtucnpkZ3lzdXhoZW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5Mjg4NTYsImV4cCI6MjA3ODUwNDg1Nn0.vgFWVEO75RHrshUGrvtNshDz7VP89OB8o8X0C77q9Yg';

const storage =
  Platform.OS === 'web'
    ? undefined // Supabase otomatis pakai localStorage
    : AsyncStorage;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  }
);


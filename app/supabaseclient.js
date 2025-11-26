import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zctaljknrzdgysuxhenh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdGFsamtucnpkZ3lzdXhoZW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5Mjg4NTYsImV4cCI6MjA3ODUwNDg1Nn0.vgFWVEO75RHrshUGrvtNshDz7VP89OB8o8X0C77q9Yg";

export const supabase = createClient(supabaseUrl, supabaseKey);
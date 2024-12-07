import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'; 

dotenv.config(); 

console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_KEY:', process.env.VITE_SUPABASE_KEY);

export default defineConfig({
  plugins: [react()],
  define: { 
    'process.env': process.env 
  } });
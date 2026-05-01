import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/PokerTrainer2/',
  define: {
    global: 'window', // Questo risolve l'errore "global" in modo corretto per Vite
  },
  plugins: [react()],
})
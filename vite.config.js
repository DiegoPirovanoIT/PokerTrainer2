import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/PokerTrainer2/', // Es: '/mio-sito-react/'
  plugins: [react()],
})
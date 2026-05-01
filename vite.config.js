import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  // Il base deve essere il nome della repo su GitHub
  base: process.env.NODE_ENV === 'production' ? '/PokerTrainer2/' : '/',
  plugins: [
    react(),
    nodePolyfills({
      // Questo abilita i polyfill necessari per le librerie di poker
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  define: {
    // Un ulteriore paracadute per le librerie vecchie
    'global': 'globalThis',
  }
})
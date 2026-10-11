import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Production builds are served from https://<user>.github.io/postpilot/, so assets need that base path.
// Local dev keeps the root path.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/postpilot/' : '/',
  plugins: [react(), tailwindcss()],
}))


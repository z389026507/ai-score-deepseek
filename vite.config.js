import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.', // ✅ 告诉 Vite：以当前目录为根
  plugins: [react()]
})

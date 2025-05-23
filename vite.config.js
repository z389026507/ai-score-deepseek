import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.', // 确保以当前目录为根
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html') // ✅ 明确入口文件
      }
    }
  }
})

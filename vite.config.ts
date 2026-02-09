import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置 base 路径，用于 GitHub Pages 部署
  // 可以通过 VITE_BASE_PATH 环境变量自定义，默认为仓库名 /temp-test/
  base: process.env.GITHUB_PAGES === 'true' 
    ? (process.env.VITE_BASE_PATH || '/temp-test/') 
    : '/',
})

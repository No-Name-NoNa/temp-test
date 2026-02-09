import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置 base 路径，用于 GitHub Pages 部署
  // 如果仓库名不是 username.github.io，需要设置为 /<repo-name>/
  base: process.env.GITHUB_PAGES === 'true' ? '/temp-test/' : '/',
})

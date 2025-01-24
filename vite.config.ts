import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'; 

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.xml'],
  plugins: [ checker({ typescript: false }), react()],
  base: '/250121_mine_view/',
})

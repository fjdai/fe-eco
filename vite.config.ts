import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  ssr: { 
    noExternal: [
      /^@mui\/.*/, // Thay thế toàn bộ các dòng @mui ở đây bằng regex này
      /^react-helmet-async$/, // Thêm react-helmet-async vào danh sách noExternal
      'redux-persist', 
    ]
  },
  server: {
    port: 3001
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  
})

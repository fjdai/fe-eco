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
    ssrManifest: true,
  },
  ssr: { 
    noExternal: [
      /^@mui\/.*/,
      /^react-helmet-async$/,
      /^react-share$/,
      /^react-toastify$/,
    ],
    target: 'node'
  },
  server: {
    port: 3001,
    strictPort: true,
    hmr: {
      timeout: 5000
    }
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
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', 'react-helmet-async', 'react-share']
  }
})
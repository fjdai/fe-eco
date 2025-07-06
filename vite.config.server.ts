import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist/server',
    ssrManifest: true,
  },
  ssr: {
    noExternal: [
      /^@mui\/.*/,
      /^react-helmet-async$/,
      /^react-share$/,
      /^react-toastify$/,
    ],
    target: 'node',
  },
})

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { localConfig } from './vite.local.config'

export default defineConfig({
  base: '/',
  plugins: [
    checker({
      typescript: true,
    }),
    react(),
    viteTsConfigPaths(),
    svgrPlugin(),
  ],
  define: {
    'process.env': process.env,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  resolve: {
    preserveSymlinks: true, // Yarn uses symbolic links to link to local workspaces.
    ...localConfig(),
  },
})

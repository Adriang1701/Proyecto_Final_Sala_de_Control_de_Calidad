import { defineConfig } from 'vite'

// JSX con el runtime automático de esbuild; no hace falta el plugin de React.
export default defineConfig({ esbuild: { jsx: 'automatic' } })

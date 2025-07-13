import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src'],
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  noExternal: ['@saas/auth', '@saas/env'],
})

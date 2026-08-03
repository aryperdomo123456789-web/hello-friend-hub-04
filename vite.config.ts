// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        "node:process": "process/browser",
        "node:util": "util",
        "node:stream": "stream-browserify",
        "node:buffer": "buffer",
        "process": "process/browser",
      },
    },
    define: {
      'process.version': '"v18.0.0"',
      'process.nextTick': '((fn, ...args) => setTimeout(() => fn(...args), 0))',
      'global': 'globalThis',
    },
    ssr: {
      // Usamos noExternal para tudo relacionado a mysql e polyfills para garantir bundling consistente
      noExternal: ['mysql2', 'sql-escaper', 'process', 'stream-browserify', 'buffer', 'util', '@supabase/supabase-js'],
    },
  },
});

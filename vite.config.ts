import { defineConfig } from 'vite' // <-- Add this import

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
    polyfillModulePreload: false,
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      output: {
        comments: false,
      },
      module: true,
      compress: {
        passes: 3,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_arrows: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    },
    rollupOptions: {
      output: {
        format: 'es',
        manualChunks: undefined,
        preferConst: true,
      },
      plugins: [
        {
          name: 'worker-plugin-fix',
          resolveId(id) {
            if (id.endsWith('?worker')) {
              return id;
            }
            return null;
          },
        },
      ],
      worker: {
        format: 'es', // Ensure the worker format is set to 'es'
      },
    },
  },
  plugins: [
    createHtmlPlugin({ minify: true }),
    injectScriptsToHtmlDuringBuild({
      input: ['./src/disable-app-if-not-supported.ts'],
    }),
    mangleClassNames(),
    vanillaExtractPlugin(),
    solidPlugin({ hot: false }),
    serviceWorker({
      manifest: {
        short_name: 'Osho',
        name: 'Osho Digital Library',
        start_url: './',
        scope: './',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone',
        orientation: 'portrait',
        description: manifest.description,
        icons: [
          {
            src: '/icons/icon_responsive.svg',
            type: 'image/svg+xml',
            sizes: 'any',
            purpose: 'any',
          },
          {
            src: '/icons/icon_maskable.svg',
            type: 'image/svg+xml',
            sizes: 'any',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          createMScreenshot('small_1', '1079x1919'),
          createMScreenshot('small_2', '1079x1919'),
          createMScreenshot('small_3', '1079x1919'),
          createMScreenshot('medium_1', '1276x960'),
          createMScreenshot('medium_2', '1276x960'),
          createMScreenshot('medium_3', '1276x960'),
        ],
      },
    }),
  ],
})

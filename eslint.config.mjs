import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'playwright-report/**',
    'test-results/**',
  ]),
  // Keep business logic framework-free (SPEC §12a)
  {
    files: ['src/server/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'next', message: 'src/server must not import from Next.' },
            { name: 'react', message: 'src/server must not import React.' },
            { name: 'react-dom', message: 'src/server must not import React.' },
          ],
          patterns: [
            {
              group: ['next/**', 'react/**', 'react-dom/**'],
              message: 'src/server must stay framework-free.',
            },
            {
              group: ['@/app/**', '@/components/**'],
              message: 'src/server must not depend on the UI layers.',
            },
          ],
        },
      ],
    },
  },
])

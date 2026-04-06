import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.expo/**',
      '**/expo-env.d.ts',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
    },
    rules: {
      // TypeScript strict
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Imports — CRITIQUE : interdit Supabase direct dans apps/
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@supabase/supabase-js'],
              message: 'Importer Supabase via @jim/shared/adapters/supabase — jamais directement.',
            },
          ],
        },
      ],

      // Pas de default export (sauf fichiers route Expo Router et Next.js)
      'import/no-default-export': 'off', // Activé au niveau app uniquement

      // Pas de barrel exports (sauf @jim/ui)
      'import/no-cycle': 'warn',
    },
  },
  // Overrides pour les apps (Expo Router + Next.js requièrent des default exports)
  {
    files: ['frontend/apps/**/*.{ts,tsx}'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
];

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        // Tests packages/shared
        test: {
          name: 'shared',
          root: './frontend/packages/shared',
          include: ['src/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        // Tests packages/ui
        test: {
          name: 'ui',
          root: './frontend/packages/ui',
          include: ['src/**/*.test.tsx'],
          environment: 'node',
        },
      },
      {
        // Tests apps/web
        test: {
          name: 'web',
          root: './frontend/apps/web',
          include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
          environment: 'node',
        },
      },
    ],
  },
});

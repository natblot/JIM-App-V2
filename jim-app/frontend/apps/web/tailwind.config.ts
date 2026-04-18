import type { Config } from 'tailwindcss';

// @ts-expect-error — fichier JS racine sans declaration de types
import rootConfig from '../../../tailwind.config.js';

const config: Config = {
  ...rootConfig,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...rootConfig.theme,
    extend: {
      ...rootConfig.theme?.extend,
      // Alias brand → jim-primary (compatibilite composants existants)
      colors: {
        ...rootConfig.theme?.extend?.colors,
        brand: {
          DEFAULT: '#ff7c5c',
          light: '#fff0ea',
          dark: '#e06245',
        },
      },
      // Accent editorial — utilise via class `font-serif italic` sur mots pivots
      fontFamily: {
        ...rootConfig.theme?.extend?.fontFamily,
        serif: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
      },
    },
  },
};

export default config;

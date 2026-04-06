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
      // Couleurs maquette Airbnb-style (en plus des tokens jim- racine)
      colors: {
        ...rootConfig.theme?.extend?.colors,
        brand: {
          DEFAULT: '#FF7A59',
          light: '#FFF0EA',
          dark: '#E06245',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
};

export default config;

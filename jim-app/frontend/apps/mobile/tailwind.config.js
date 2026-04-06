/** @type {import('tailwindcss').Config} */
module.exports = {
  // Etendre la config racine avec les tokens JIM
  presets: [require('nativewind/preset'), require('../../../tailwind.config.js')],
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [],
};

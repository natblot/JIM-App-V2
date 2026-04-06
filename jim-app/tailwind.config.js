/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    screens: {
      'xs': '375px',    // iPhone standard — ajustements typographiques
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      // Typographie — Outfit (proche de Genty Sans)
      // Pour Genty Sans : installer localement et ajouter en premier dans la liste
      fontFamily: {
        sans: ['var(--font-outfit)', 'Genty Sans', 'system-ui', 'sans-serif'],
      },
      // Palette Orange Pastel JIM v2.0
      colors: {
        'jim-primary':        'oklch(0.65 0.14 45)',   /* #E8844A */
        'jim-primary-mid':    'oklch(0.73 0.10 45)',   /* #F0A07A */
        'jim-primary-soft':   'oklch(0.82 0.07 45)',   /* #F7C5A0 */
        'jim-primary-pale':   'oklch(0.93 0.03 45)',   /* #FDEADE */
        'jim-accent':         'oklch(0.57 0.17 38)',   /* #D4603A */
        'jim-accent-warm':    'oklch(0.78 0.12 60)',   /* #F5B86A */
        'jim-background':     'oklch(0.98 0.008 55)',  /* #FEF9F5 */
        'jim-surface':        'oklch(1.00 0.00 0)',    /* #FFFFFF */
        'jim-surface-alt':    'oklch(0.95 0.02 50)',   /* #FBF0E8 */
        'jim-beige-dark':     'oklch(0.83 0.04 52)',   /* #DCBFA0 */
        'jim-beige-mid':      'oklch(0.88 0.03 52)',   /* #EDD9C4 */
        'jim-beige-light':    'oklch(0.93 0.02 52)',   /* #F7EDE0 */
        'jim-text':           'oklch(0.20 0.04 45)',   /* #3A1F08 */
        'jim-text-body':      'oklch(0.30 0.04 42)',   /* #5A3418 */
        'jim-muted':          'oklch(0.52 0.06 45)',   /* #96694A */
        'jim-border':         'oklch(0.88 0.03 52)',   /* #EDD9C4 */
        'jim-success':        'oklch(0.63 0.07 148)',  /* #6B9E72 */
        'jim-success-bg':     'oklch(0.95 0.03 148)',  /* #EAF3EB */
        'jim-warning':        'oklch(0.65 0.12 70)',   /* #C8882A */
        'jim-warning-bg':     'oklch(0.96 0.04 70)',   /* #FBF0DC */
        'jim-destructive':    'oklch(0.53 0.14 28)',   /* #C45040 */
        'jim-destructive-bg': 'oklch(0.95 0.03 28)',   /* #FAEBE8 */
      },
      borderRadius: {
        sm:  '0.5rem',    /* 8px */
        DEFAULT: '1rem',  /* 16px */
        lg:  '1.5rem',    /* 24px */
        xl:  '2.25rem',   /* 36px */
      },
      boxShadow: {
        'jim':       '0 2px 16px 0 rgba(58,31,8,0.08)',
        'jim-hover': '0 4px 28px 0 rgba(58,31,8,0.15)',
      },
    },
  },
  plugins: [],
};

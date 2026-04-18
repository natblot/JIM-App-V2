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
      // Typographie — Manrope (aligne design-tokens.css + web override)
      fontFamily: {
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
      },
      // Palette Corail JIM v2.1 — source unique, aligne CLAUDE.md landing + dashboard
      colors: {
        'jim-primary':        '#ff7c5c',   /* corail principal — CTA, icones actives */
        'jim-primary-mid':    '#ff9a80',   /* hover, variante claire */
        'jim-primary-soft':   '#ffc5b3',   /* separateurs, accents doux */
        'jim-primary-pale':   '#fff0ea',   /* backgrounds chips/badges */
        'jim-accent':         '#e06245',   /* corail fonce, highlights */
        'jim-accent-warm':    '#F5B86A',   /* ambre/miel */
        'jim-background':     '#fdf6ed',   /* beige chaud — fond global */
        'jim-surface':        '#FFFFFF',   /* carte, modal */
        'jim-surface-alt':    '#FBF0E8',   /* surface secondaire */
        'jim-beige-dark':     '#DCBFA0',
        'jim-beige-mid':      '#EDD9C4',   /* bordure */
        'jim-beige-light':    '#F7EDE0',
        'jim-text':           '#3A1F08',   /* titres */
        'jim-text-body':      '#5A3418',   /* corps */
        'jim-muted':          '#7A5434',   /* secondaire (assombri pour WCAG AA) */
        'jim-border':         '#EDD9C4',
        'jim-success':        '#5D8F66',   /* vert sauge (assombri pour WCAG AA) */
        'jim-success-bg':     '#EAF3EB',
        'jim-warning':        '#B07824',   /* ambre (assombri pour WCAG AA) */
        'jim-warning-bg':     '#FBF0DC',
        'jim-destructive':    '#B84030',   /* rouge orange (assombri pour WCAG AA) */
        'jim-destructive-bg': '#FAEBE8',
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

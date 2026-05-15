/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--brand-primary)',
        'primary-variant': 'var(--brand-primary-variant)',
        accent: 'var(--brand-accent)',
        'accent-2': 'var(--brand-accent-2)',
        surface0: 'var(--surface-0)',
        surface1: 'var(--surface-1)',
        surface2: 'var(--surface-2)',
        border: 'var(--border)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)']
      },
      boxShadow: {
        token: 'var(--shadow-1)'
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)'
      }
    }
  },
  plugins: []
};

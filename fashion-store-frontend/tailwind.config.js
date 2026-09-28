/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],

  theme: {
    extend: {

      // ── Colors من DESIGN.md ──────────────────────────────
      colors: {
        primary: {
          DEFAULT: '#00236f',
          container: '#1e3a8a',
          on: '#ffffff',
          'on-container': '#90a8ff',
          inverse: '#b6c4ff',
        },
        secondary: {
          DEFAULT: '#755b00',
          container: '#fed977',
          on: '#ffffff',
          'on-container': '#785d00',
        },
        tertiary: {
          DEFAULT: '#4b1c00',
          container: '#6e2c00',
          on: '#ffffff',
          'on-container': '#f39461',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          on: '#ffffff',
          'on-container': '#93000a',
        },
        surface: {
          DEFAULT: '#faf8ff',
          dim: '#dad9e1',
          bright: '#faf8ff',
          low: '#f4f3fa',
          container: '#eeedf4',
          high: '#e9e7ef',
          highest: '#e3e1e9',
          lowest: '#ffffff',
          variant: '#e3e1e9',
          tint: '#4059aa',
        },
        'on-surface': {
          DEFAULT: '#1a1b21',
          variant: '#444651',
        },
        outline: {
          DEFAULT: '#757682',
          variant: '#c5c5d3',
        },
        background: '#faf8ff',
      },

      // ── Typography ───────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-xl': ['40px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '500' }],
      },

      // ── Spacing (8px base) ───────────────────────────────
      spacing: {
        'xs': '4px',
        'sm': '16px',
        'md': '24px',
        'lg': '48px',
        'xl': '80px',
        'gutter': '24px',
        'margin': '32px',
      },

      // ── Border Radius ─────────────────────────────────────
      borderRadius: {
        'sm': '0.125rem',   // 2px
        DEFAULT: '0.25rem',   // 4px
        'md': '0.375rem',   // 6px  — buttons, inputs
        'lg': '0.5rem',     // 8px  — cards
        'xl': '0.75rem',    // 12px — product cards
        'full': '9999px',     // chips
      },

      // ── Max Width ────────────────────────────────────────
      maxWidth: {
        'container': '1280px',
      },

      // ── Aspect Ratio ─────────────────────────────────────
      aspectRatio: {
        'product': '3 / 4',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Indigo (Authority, Intelligence)
        indigo: {
          50: '#eef2ff',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        // Neutrals - Slate (Refined, Technical)
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Layer 8 - Cyan (Data, Intelligence)
        layer8: {
          50: '#ecfeff',
          500: '#06b6d4',
          700: '#0e7490',
        },
        // Semantic Colors
        success: {
          50: '#ecfdf5',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50: '#fff1f2',
          600: '#e11d48',
          700: '#be123c',
        },
        info: {
          50: '#f0f9ff',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      fontFamily: {
        display: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        0.5: '0.125rem',   // 2px
        1: '0.25rem',       // 4px
        1.5: '0.375rem',    // 6px
        2: '0.5rem',        // 8px - Base unit
        3: '0.75rem',       // 12px
        4: '1rem',          // 16px
        5: '1.25rem',       // 20px
        6: '1.5rem',        // 24px
        8: '2rem',          // 32px
        10: '2.5rem',       // 40px
        12: '3rem',         // 48px
        16: '4rem',         // 64px
        20: '5rem',         // 80px
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08)',
        'layer8-glow': '0 0 20px rgba(6, 182, 212, 0.3)',
      },
      transitionDuration: {
        fast: '100ms',
        DEFAULT: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        fadeIn: 'fadeIn 200ms ease',
        slideInUp: 'slideInUp 300ms ease',
      },
    },
  },
  plugins: [],
};

export default config;

/* eslint-disable ts/no-require-imports */
import type { Config } from 'tailwindcss';
import { withUt } from 'uploadthing/tw';

export default withUt({
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'engineering-dark-blue': 'url("/engineering-background-dark-blue.png")',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          0: '#F0F8FF',
          50: '#AFDBFF',
          100: '#69BBFE',
          200: '#3CA4F8',
          300: '#238BDE',
          400: '#1F7AC3',
          500: '#1B70B5',
          600: '#1565A6',
          700: '#155A92',
          800: '#144C7A',
          900: '#0E3C61',
          950: '#092C49',
          DEFAULT: '#1B70B5',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          0: '#FFF3FC',
          50: '#FBC9EE',
          100: '#F99AE0',
          200: '#F66CD4',
          300: '#E453BF',
          400: '#D648B2',
          500: '#C137A2',
          600: '#AC258D',
          700: '#9D1880',
          800: '#910D75',
          900: '#6E015A',
          950: '#4A033D',
          DEFAULT: '#C137A2',
          foreground: 'hsl(var(--primary-foreground))',
        },
        tertiary: {
          0: '#E2FFFF',
          50: '#A0FFFF',
          100: '#44F8F7',
          200: '#26E8E7',
          300: '#26D5D4',
          400: '#1ABEBD',
          500: '#16B2B1',
          600: '#17A1A0',
          700: '#139291',
          800: '#158584',
          900: '#117C7C',
          950: '#0E6A6A',
          DEFAULT: '#16B2B1',
          foreground: 'hsl(var(--primary-foreground))',
        },
        success: {
          600: 'hsl(var(--success-600))',
          background: 'hsl(var(--success-background))',
        },
        error: {
          background: 'hsl(var(--error-background))',
          800: 'hsl(var(--error-800))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          'DEFAULT': '#F0F8FF',
          'foreground': 'hsl(var(--sidebar-foreground))',
          'primary': 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          'accent': 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          'border': 'hsl(var(--sidebar-border))',
          'ring': 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}) satisfies Config;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Light-mode base: a cool, paper-adjacent grey-green rather than
        // the near-universal warm cream — reads more like graph paper /
        // a planner than a marketing page.
        mist: {
          50: '#F7F9F8',
          100: '#EDF1F0',
          200: '#DDE4E2',
          300: '#C3CDCA',
        },
        ink: {
          700: '#3A4240',
          800: '#262E2C',
          900: '#1C2321',
        },
        // Brand/UI accent — a calm dusk-indigo. Deliberately not the warm
        // terracotta or acid-green that read as generic "AI product" tells.
        dusk: {
          50: '#EEF0F8',
          100: '#DCE0F1',
          200: '#B9C2E3',
          300: '#96A3D5',
          400: '#5E6EA0',
          500: '#3B4B7A',
          600: '#2F3D63',
          700: '#242F4C',
          800: '#1A2237',
          900: '#0F1422',
        },
        // Dark mode base: a night-blue, not pure black.
        night: {
          900: '#14171F',
          800: '#1B1F2A',
          700: '#242938',
          600: '#323A4D',
        },
        flame: {
          400: '#FFB648',
          500: '#F5A623',
          600: '#DB8A0E',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28, 35, 33, 0.06), 0 4px 16px rgba(28, 35, 33, 0.06)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

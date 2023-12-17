import type { Config } from 'tailwindcss';

import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  jit: true,
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      ...defaultTheme,
      colors: {
        primary: '#0978e7',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
} satisfies Config;

import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'sky-blue': {
          50: '#eaffff',
          100: '#cbfdff',
          200: '#9ef8ff',
          300: '#5bf0ff',
          400: '#00dbff',
          500: '#00c0e5',
          600: '#0098c0',
          700: '#03799b',
          800: '#0d617d',
          900: '#105069',
          950: '#033449',
        },
      },
      gridRow: {
        'span-8': 'span 8 / span 8',
      },
    },
  },
  content: [
    'content/**/*.{md,yml}',
    '.nuxt/content-cache/**/*.{md,yml}'
  ]
};

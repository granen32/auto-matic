import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#102542',
        mist: '#eef4f8',
        signal: '#d96c06',
        pine: '#2d5d4d',
      },
      boxShadow: {
        panel: '0 20px 45px rgba(16, 37, 66, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config

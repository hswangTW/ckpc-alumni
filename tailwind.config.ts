import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'ckpc-buff' : {
          verylight: '#F0E2D1',
          light: '#E9D2B8',
          DEFAULT: '#ECB88A',
        },
        'ckpc-brown': '#503B31',
        'ckpc-blue': {
          verylight: '#C8F4FC',
          light: '#ADD3DA',
        },
        'ckpc-green': '#80B192',
      },
    },
  },
  plugins: [],
}
export default config

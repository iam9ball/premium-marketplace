import type { Config } from "tailwindcss";


const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
 
  theme: {
    fontFamily: {
      'logo': [ '"Helvetica Neue"','"Courier New"']
    },
    extend: {
       boxShadow: {
        'neon': '0 0 20px #7928CA, 0 0 40px #FF0080, 0 0 60px #4A148C',
      },
      backgroundSize: {
        'gradient-400': '400% 400%'
      },
       pulse: {
          '0%': { transform: 'scale(0.33)', opacity: '1' },
          '80%, 100%': { opacity: '0' }
        },
        circle: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.8)' }
        },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translatey(40px)' },
          '100%': { opacity: '1', transform: 'translatey(0)' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
         enter: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        leave: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
      },
      animation: {
        gradient: 'gradient 15s ease infinite',
         fadeIn: 'fadeIn 0.6s both',
        pulse: 'pulse 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        circle: 'circle 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite',
         enter: 'enter 200ms ease-out',
        leave: 'leave 150ms ease-in forwards',
      },
      backgroundImage: {
'gradient-animated': 'linear-gradient(-45deg, #7928CA, #2D3748, #4A148C, #FF0080)', },
    },
  },
  plugins: [],
};
export default config;
// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: '#111827',
          surface: '#1F2937',
          primary: {
            400: '#818CF8',
            500: '#6366F1',
            600: '#4F46E5',
          },
          text: {
            primary: '#F9FAFB',
            secondary: '#9CA3AF',
          }
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
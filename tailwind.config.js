/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6',   // blue-500
          dark: '#1e40af',    // blue-800
        },
        secondary: {
          DEFAULT: '#6366f1', // indigo-500
          light: '#818cf8',   // indigo-400
          dark: '#3730a3',    // indigo-800
        },
        accent: {
          DEFAULT: '#f59e42', // orange-400
          light: '#fbbf24',   // yellow-400
          dark: '#b45309',    // yellow-800
        },
        success: {
          DEFAULT: '#10b981', // green-500
          light: '#6ee7b7',   // green-300
          dark: '#047857',    // green-800
        },
        warning: {
          DEFAULT: '#f59e42', // orange-400
          light: '#fbbf24',   // yellow-400
          dark: '#b45309',    // yellow-800
        },
        danger: {
          DEFAULT: '#ef4444', // red-500
          light: '#fca5a5',   // red-300
          dark: '#991b1b',    // red-800
        },
        info: {
          DEFAULT: '#0ea5e9', // sky-500
          light: '#38bdf8',   // sky-400
          dark: '#0369a1',    // sky-800
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anonytext: '#dccae9',
        anonybg: '#2d1a47',
        anonyprimary: '#634189',
        anonysecondary: '#d2d9e8',
        anonyaccent: '#796fa9',
        anonygold: '#9c7b05',
        anonylighttext: '#b393c9',
      },
    },
  },
  plugins: [],
}


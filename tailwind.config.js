/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light' : '#EFECEA',
        'dark' : '#252422',
        'primary' : '#7C7BC6',
      },
      backgroundColor: {
        'light' : '#EFECEA',
        'dark' : '#252422',
        'primary' : '#7C7BC6', // Violet → Code à changer
        'black-transparence' : 'rgba(0, 0, 0, 0.726)'
      },
      fontFamily: {
        'soria': ['Soria', 'serif'], 
      },
    },
  },
  plugins: [],
}


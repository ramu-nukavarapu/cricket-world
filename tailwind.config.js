/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./public/**/*.{html,js}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'home-pc': "url('/public/assets/homePC.jpg')",
        'home-mob': "url('/public/assets/homeMOB.jpeg')",
        'vs-pc': "url('/public/assets/vsPC.jpeg')",
        'vs-mob': "url('/public/assets/vsMOB.jpeg')",
        'board-pc': "url('/public/assets/boardPC.jpeg')",
        'board-mob': "url('/public/assets/boardMOB.jpeg')",
      }
    },
  },
  plugins: [],
}


module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["Poppins"],
      },
      backgroundImage: {
        loginBack: "url('../src/assets/img/background.jpg')",
      },
      colors: {
        blue: {
          100: "#039BE5",
          200: "#0298E3",
          300: "#0287C9",
        },
      },
    },
  },

  plugins: [],
};
